import { toArray } from 'lodash';
import { conn } from './../../index';

class AddressAsync {
  async getAddress (id) {
    return (await conn.query(`SELECT * FROM addresses WHERE id=${id}`))[0];
  }

  async getAddressesByTerritory (terrId) {
    return toArray(await conn.query(`SELECT * FROM addresses WHERE territory_id=${terrId}`));
  }

  async searchAddresses (keyword) {
    return toArray(await conn.query(`SELECT * FROM addresses WHERE addr1 LIKE '%${keyword}%' OR addr2 LIKE '%${keyword}%' OR addr3 LIKE '%${keyword}%'`));
  }
}

export default new AddressAsync();
