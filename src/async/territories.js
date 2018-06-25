import { toArray } from 'lodash';
import { conn } from './../../index';

class TerritoryAsync {
  async getTerritory (id) {
    return (await conn.query(`SELECT * FROM territories WHERE id=${id}`))[0];
  }

  async getTerritories (congId) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE congregationid=${congId}`));
  }

  async searchTerritories (keyword) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`));
  }

  async getCheckedOutTerritories (publisherId) {
    return toArray(await conn.query(`SELECT * FROM checked_out_territories WHERE publisherid=${publisherId}`));
  }
}

export default new TerritoryAsync();
