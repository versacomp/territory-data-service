import publisherAsync from './../../async/publishers';
import congAsync from './../../async/congregations';
import terrAsync from './../../async/territories';

export const Publisher = `
  type Publisher {
    id: Int!
    congregationid: Int!
    firstname: String
    lastname: String
    congregation: Congregation
    checkedOutTerritories: [Territory]
  }
`;

export const queries = `
  checkedOutTerritories(publisherId: Int): [Territory]
`;

export const resolvers = {
  publisher: async (root, args) => {
    try {
      const result = await publisherAsync.getPublisherByName(args.firstname, args.lastname);
      return result;
    } catch (err) {
      console.error(err);
    }
  },

  congregation: async (root, args) => {
    try {
      return await congAsync.getCongregationById(root.congregationid);
    } catch (err) {
      console.error(err);
    }
  },

  checkedOutTerritories: async (root, args) => {
    try {
      console.log('root.id:', root.id);
      if (root.id) {
        return await terrAsync.getCheckedOutTerritories(root.id);
      }
    } catch (err) {
      console.error(err);
    }
  },
};