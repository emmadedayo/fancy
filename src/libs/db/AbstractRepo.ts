import { EntityTarget, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity } from "./BaseEntity";
import { readConnection, writeConnection } from "./DatabaseModule";
import { NotFoundException } from "@nestjs/common";

export abstract class AbstractRepo<T extends BaseEntity> {
  constructor(protected readonly entityTarget: EntityTarget<T>) {}

  async save(entity: T): Promise<T> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entity);
  }

  async exists(where: FindOptionsWhere<T>) {
    const res = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where });

    return !!res === true;
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>
  ): Promise<T> {
    const entity = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where, relations });

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn("Entity not found with where", where);
      throw new NotFoundException("Entity not found.");
    }

    return this.findOne(where);
  }

  async findPaginated(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>
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

  async find(
    where: FindOptionsWhere<T>,
    order: Record<string, any> = {},
    relations?: FindOptionsRelations<T>
  ) {
    return readConnection.getRepository(this.entityTarget).find({
      where,
      order,
      relations,
    });
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
    currentPage: number = 1
  ) {
    try {
      const queryBuilder = readConnection
        .getRepository(this.entityTarget)
        .createQueryBuilder(entityName);

      const whereConditions = columns.map(
        (column) => `${entityName}.${column} LIKE :term`
      );

      const offset = (currentPage - 1) * pageSize;

      const [data, total] = await queryBuilder
        .where(`(${whereConditions.join(" OR ")})`, { term: `%${keyword}%` })
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
}
