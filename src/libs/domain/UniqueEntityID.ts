// import { Identifier } from "./Identifier";
// import { Snowflake } from "nodejs-snowflake";

// export class UniqueEntityID extends Identifier<bigint> {
//   constructor(id?: bigint) {
//     const _uid = new Snowflake();
//     super(id ? id : _uid.idFromTimestamp(Date.now()).valueOf());
//   }
// }

import { v4 as uuid } from 'uuid';
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : uuid());
  }
}
