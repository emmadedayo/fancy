import {
  EntityTarget,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './BaseEntity';
import { readConnection, writeConnection } from './DatabaseModule';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepo<T extends BaseEntity> {
  protected constructor(protected readonly entityTarget: EntityTarget<T>) {}

  async save(entity: T): Promise<T> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entity);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entities);
  }

  async exists(where: FindOptionsWhere<T>) {
    const res = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where });

    return !!res === true;
  }

  //update
  async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: (keyof T)[],
  ): Promise<T | null> {
    const repository = readConnection.getRepository(this.entityTarget);
    const metadata = repository.metadata;
    const hasDeletedAtColumn = metadata.columns.some(
      (column) =>
        column.propertyName === 'deletedAt' ||
        column.databaseName === 'deleted_at',
    );
    const options: FindOneOptions<T> = {
      where,
      relations,
      select,
    };
    if (hasDeletedAtColumn) {
      options.where = {
        ...where,
        deletedAt: null,
      };
    }
    return repository.findOne(options);
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findPaginated(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>,
  ) {
    pageSize = pageSize ? pageSize : 10;
    currentPage = currentPage ? currentPage : 1;
    const offset = (currentPage - 1) * pageSize;

    const res = await readConnection
      .getRepository(this.entityTarget)
      .findAndCount({
        take: pageSize,
        skip: offset,
        where,
        order,
        relations,
      });

    const [data, total] = res;

    if (!data.length) {
      return {
        data: [],
      };
    }

    return {
      data,
      pagination: {
        total,
        pageSize,
        currentPage,
      },
    };
  }

  async findPostPagination(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>,
  ): Promise<{
    data: T[];
    pagination?: { total: number; pageSize: number; currentPage: number };
  }> {
    pageSize = pageSize || 10;
    currentPage = currentPage || 1;
    const offset = (currentPage - 1) * pageSize;

    const repository = readConnection.getRepository(this.entityTarget);
    const tableName = repository.metadata.tableName;

    const queryBuilder = repository.createQueryBuilder(tableName);

    // Apply where conditions (if provided)
    if (where) {
      queryBuilder.where(where);
    }

    // Apply sorting (if provided)
    if (order) {
      queryBuilder.orderBy(order);
    }

    // Handle nested relations eager loading
    const relationKeys = Object.keys(relations || {});
    if (relationKeys.includes('post')) {
      queryBuilder.leftJoinAndSelect(`${tableName}.post`, 'post');
      if (relations['post'].images) {
        queryBuilder.leftJoinAndSelect('post.images', 'images');
      }
    }

    queryBuilder
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap(
        'post.shareCount',
        'post.views',
        'shares',
        (qb) => qb.where('shares.type = :type', { type: 'share' }),
      );

    const [data, total] = await queryBuilder
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    if (!data.length) {
      return {
        data: [],
      };
    }

    return {
      data,
      pagination: {
        total,
        pageSize,
        currentPage,
      },
    };
  }

  async find(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    order: Record<string, any> = {},
    relations?: FindOptionsRelations<T>,
  ) {
    return readConnection.getRepository(this.entityTarget).find({
      where,
      order,
      relations,
    });
  }

  //findOne By multiple conditions
  async findOneByMultipleConditions(
    where: FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T>,
  ) {
    return readConnection.getRepository(this.entityTarget).findOne({
      where,
      relations,
    });
  }

  //find one
  async findOneOrFail(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    const entity = await readConnection
      .getRepository(this.entityTarget)
      .findOneOrFail({ where, relations });

    return entity;
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    const res = await writeConnection.manager
      .getRepository(this.entityTarget)
      .delete(where);

    return {
      status: !!res.affected,
    };
  }

  async search(
    keyword: string,
    columns: string[],
    entityName: string,
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    try {
      const queryBuilder = readConnection
        .getRepository(this.entityTarget)
        .createQueryBuilder(entityName);

      const whereConditions = columns.map(
        (column) => `${entityName}.${column} LIKE :term`,
      );

      const offset = (currentPage - 1) * pageSize;

      const [data, total] = await queryBuilder
        .where(`(${whereConditions.join(' OR ')})`, { term: `%${keyword}%` })
        .skip(offset)
        .take(pageSize)
        .getManyAndCount();

      return {
        data,
        pagination: {
          total,
          pageSize,
          currentPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      const res = await readConnection.getRepository(this.entityTarget).count();

      return res;
    } catch (error) {
      throw error;
    }
  }

  async countWhere(where?: FindOptionsWhere<T>) {
    try {
      const res = await readConnection.getRepository(this.entityTarget).count({
        where,
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async countWhereIn(
    where: FindOptionsWhere<T>,
    columnName: string,
    values: any[],
  ) {
    try {
      const res = await readConnection
        .getRepository(this.entityTarget)
        .count({ where: { ...where, [columnName]: In(values) } });
      return res;
    } catch (error) {
      throw error;
    }
  }

  //fetch all
  async fetchAll() {
    return readConnection.getRepository(this.entityTarget).find();
  }

  async sumWithConditions(
    columnName: string,
    where?: FindOptionsWhere<T>,
  ): Promise<number> {
    const queryBuilder = readConnection
      .getRepository(this.entityTarget)
      .createQueryBuilder();
    const sum = await queryBuilder
      .select(`SUM(${columnName})`, 'sum')
      .where(where)
      .getRawOne();
    return sum.sum || 0;
  }

  async findPost(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>,
    top: boolean = false,
    user_id?: string,
  ): Promise<{
    data: T[];
    pagination?: { total: number; pageSize: number; currentPage: number };
  }> {
    pageSize = pageSize || 10;
    currentPage = currentPage || 1;
    const offset = (currentPage - 1) * pageSize;

    const repository = readConnection.getRepository(this.entityTarget);
    const tableName = repository.metadata.tableName;

    const queryBuilder = repository.createQueryBuilder(tableName);

    // Apply where conditions (if provided)
    if (where) {
      queryBuilder.where(where);
    }

    // Apply sorting (if provided)
    if (order) {
      queryBuilder.orderBy(order);
    }

    if (top) {
      queryBuilder
        .leftJoin('post_likes', 'pl', `${tableName}.id = pl.post_id`)
        .leftJoinAndSelect(`${tableName}.images`, 'images')
        .leftJoinAndSelect(`${tableName}.user`, 'user')
        .groupBy(`${tableName}.id`)
        .addGroupBy('pl.post_id')
        .addGroupBy('images.id') // Ensure images columns are included in the GROUP BY clause
        .addGroupBy('user.id') // Ensure user columns are included in the GROUP BY clause
        .addGroupBy('images.created_at') // Include additional image columns if needed
        .addGroupBy('user.updated_at') // Include additional image columns if needed
        .addGroupBy('user.created_at') // Include additional image columns if needed
        .having('COUNT(pl.post_id) > :likesThreshold', { likesThreshold: -1 }); // Adjust threshold as needed
    }

    // Handle nested relations eager loading
    if (relations) {
      Object.keys(relations).forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${tableName}.${relation}`, relation);
        if (relations[relation] && typeof relations[relation] === 'object') {
          Object.keys(relations[relation]).forEach((nestedRelation) => {
            queryBuilder.leftJoinAndSelect(
              `${relation}.${nestedRelation}`,
              nestedRelation,
            );
          });
        }
      });
    }
    queryBuilder
      .loadRelationCountAndMap(`${tableName}.likeCount`, `${tableName}.likes`)
      .loadRelationCountAndMap(
        `${tableName}.commentCount`,
        `${tableName}.comments`,
      )
      .loadRelationCountAndMap(
        `${tableName}.shareCount`,
        `${tableName}.views`,
        'shares',
        (qb) => qb.where('shares.type = :type', { type: 'share' }),
      )
      .loadRelationCountAndMap(
        `${tableName}.viewCount`,
        `${tableName}.views`,
        'views',
        (qb) => qb.where('views.type = :type', { type: 'view' }),
      );

    const [data, total] = await queryBuilder
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    if (!data.length) {
      return {
        data: [],
      };
    }

    // @ts-ignore
    const ids = data.map((post) => post.id);
    //check if user has liked the post
    //select from post_likes where user_id = user_id and post_id in (ids)
    const likedPosts = await readConnection
      .getRepository('PostLikeEntity')
      .find({
        where: {
          user_id,
          post_id: In(ids),
        },
      });
    //add liked field to the post as boolean
    data.forEach((post) => {
      // @ts-ignore
      const likedPost = likedPosts.find((lp) => lp.post_id === post.id);
      post['liked'] = !!likedPost;
    });
    //select from post_views where user_id = user_id and post_id in (ids)
    const viewedPosts = await readConnection
      .getRepository('PostViewEntity')
      .find({
        where: {
          user_id,
          post_id: In(ids),
          type: 'share',
        },
      });
    //add viewed field to the post as boolean
    data.forEach((post) => {
      // @ts-ignore
      const viewedPost = viewedPosts.find((vp) => vp.post_id === post.id);
      post['shared'] = !!viewedPost;
    });
    //check if user has paid for the post
    const isPaidPosts = await readConnection
      .getRepository('PostPaidViewEntity')
      .find({
        where: {
          user_id,
          post_id: In(ids),
        },
      });
    //add paid field to the post as boolean
    data.forEach((post) => {
      // @ts-ignore
      const isPaidPost = isPaidPosts.find((ip) => ip.post_id === post.id);
      post['paid'] = !!isPaidPost;
    });
    return {
      data,
      pagination: {
        total,
        pageSize,
        currentPage,
      },
    };
  }
}
