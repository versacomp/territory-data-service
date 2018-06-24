import { TerritoryAsync } from './../../async/territories';

const aliases = `,
  congregationid as congregationId
`;

export const Territory = `
  type Territory {
    id: Int!
    congregationid: Int!
    name: String
    description: String
    type: String
    addresses: [Address]
  }
`;

export const queries = `
  territory(id: Int): Territory
  territories(congId: Int, keyword: String): [Territory]
`;

export const resolvers = {
  territory: async (root, args) => {
    try {
      const terrAsync = new TerritoryAsync();
      return await terrAsync.getTerritory(args.id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  territories: async (root, args) => {
    try {
      const terrAsync = new TerritoryAsync();
      console.log(root);
      console.log(args);
      let result;
      if (args.congId || root.id) {
        result = await terrAsync.getTerritories(args.congId || root.id);
      }

      if (args.keyword) {
        result = await terrAsync.searchTerritories(args.keyword);
      }

      return result;

    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
