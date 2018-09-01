import publisherAsync from './../../async/publishers';
import congAsync from './../../async/congregations';
import terrAsync from './../../async/territories';

export const Publisher = `
  type Publisher {
    id: Int!
    congregationid: Int!
    firstname: String
    lastname: String
    username: String
    congregation: Congregation
    status: String
    checkedOutTerritories: [Territory]
    role: String
    role_description: String
  }
`;

export const queries = `
  publishers(congId: Int, keyword: String): [Publisher]
  checkedOutTerritories(publisherId: Int): [Territory]
`;

export const queryResolvers = {
  user: async (root, args) => {
    try {
      return await publisherAsync.getUser(args.username);
    } catch (err) {
      console.error(err);
    }
  },

  publisher: async (root, args) => {
    try {
      if (args.publisherId) {
        return await publisherAsync.getPublisherById(args.publisherId);
      }
      else if (args.firstname && args.lastname) {
        return await publisherAsync.getPublisherByName(args.firstname, args.lastname);
      }
    } catch (err) {
      console.error(err);
    }
  },

  publishers: async (root, args) => {
    try {
      const id = root ? root.id : (args ? args.congId : undefined);
      if (!id) {
        throw new Error('Congregation Id is required to query for publishers');
      }
      
      const result = await publisherAsync.searchPublishers(id, args.keyword);
      return result;
    } catch (err) {
      console.error(err);
    }
  },

  checkedOutTerritories: async (root, args) => {
    try {
      if (root.id) {
        return await terrAsync.getCheckedOutTerritories(root.id);
      }
    } catch (err) {
      console.error(err);
    }
  },
};