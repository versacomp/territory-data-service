import { toArray } from 'lodash';
import { conn } from './../../index';

class PublisherAsync {
  async getPublisherById (id) {
    return (await conn.query(`SELECT firstname, lastname, congregationid FROM publishers WHERE id=${id}`))[0];
  }

  async getPublisherByName (firstName, lastName) {
    return (await conn.query(`SELECT * FROM publishers WHERE firstname='${firstName}' AND lastname='${lastName}'`))[0];
  }

  async searchPublishers (keyword) {
    return toArray(await conn.query(`SELECT firstname, lastname, congregationid FROM publishers WHERE firstname LIKE '%${keyword}%' OR lastname LIKE '%${keyword}%'`));
  }
}

export default new PublisherAsync();
