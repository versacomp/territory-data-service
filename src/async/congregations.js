import { toArray } from 'lodash';
import { conn } from './../../index';

export  class CongregationAsync {
  async getCongregationById (id) {
    return (await conn.query(`SELECT * FROM congregations WHERE id=${id}`))[0];
  }

  async getAllCongregations () {
    return toArray(await conn.query(`SELECT * FROM congregations`));
  }

  async searchCongregations (keyword) {
    const result = toArray(await conn.query(`SELECT * FROM congregations WHERE name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`));
    console.log(result);
    return result;
  }
}
