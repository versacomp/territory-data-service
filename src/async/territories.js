import { toArray } from 'lodash';
import { conn } from './../../index';

export  class TerritoryAsync {
  async getTerritory (id) {
    return (await conn.query(`SELECT * FROM territories WHERE id=${id}`))[0];
  }

  async getTerritories (congId) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE congregationid=${congId}`));
  }

  async searchTerritories (keyword) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`));
  }
}
