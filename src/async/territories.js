import { toArray } from 'lodash';
import { conn } from './../../index';

class TerritoryAsync {
  async getTerritory (id) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE id=${id}`))[0];
  }

  async getTerritories (congId) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE congregationid=${congId}`));
  }

  async searchTerritories (congId, keyword) {
    return toArray(await conn.query(`SELECT * FROM territories WHERE congregationid=${congId} name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`));
  }

  async getTerritoryStatus (congId, territoryId, publisherId) {
    return toArray(await conn.query(
      `
        SELECT * FROM territorycheckouts ck JOIN territories t ON ck.territoryid = t.id WHERE t.congregationid=${congId}
        ${!!territoryId ? ` AND ck.territoryid=${territoryId}` : ''}
        ${!!publisherId ? ` AND ck.publisherid=${publisherId}` : ''}
      `
    ));
  }

  async getTerritoriesByCity (congId, city) {
    let result;
    if (city) {
      result = toArray(await conn.query(`SELECT * FROM territories_by_city WHERE congregationid=${congId} AND city='${city}'`));
    } else {
      result = toArray(await conn.query(`SELECT * FROM territories_by_city WHERE congregationid=${congId}`));
    }
    return result;
  }

  async getTerritoriesByGroupCode (congId, groupCode) {
    return toArray(await conn.query(`SELECT * FROM territories_by_city WHERE congregationid=${congId} AND group_code='${groupCode}' ORDER BY city, name`));
  }
}

export default new TerritoryAsync();
