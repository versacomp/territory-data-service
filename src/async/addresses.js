import { toArray } from 'lodash';
import { conn } from './../../index';

class AddressAsync {
  async getAddress (id) {
    return (await conn.query(`SELECT * FROM addresses WHERE id=${id}`))[0];
  }

  async getAddressesByTerritory (terrId) {
    return toArray(await conn.query(`SELECT * FROM addresses WHERE territory_id=${terrId}`));
  }

  async searchAddresses (congId, keyword) {
    return toArray(await conn.query(`SELECT * FROM addresses WHERE congregationid=${congId} AND addr1 LIKE '%${keyword}%' OR addr2 LIKE '%${keyword}%'`));
  }

  async getDNC (congId) {
    return toArray(await conn.query(`SELECT * FROM addresses WHERE congregationid=${congId} AND notes LIKE '%DO NOT CALL%'`));
  }
}

export default new AddressAsync();
