import terrAsync from './../../async/territories';

const aliases = `,
  congregationid as congregationId
`;

export const Territory = `
  type Territory {
    group_code: String!
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
  territories(congId: Int, keyword: String, city: String): [Territory]
`;

export const resolvers = {
  territory: async (root, args) => {
    try {
      let result;
      if (args.keyword) {
        result = await terrAsync.getTerritory(args.id);
      }

      if (root && root.territory_id) {
        result = await terrAsync.getTerritory(root.territory_id);
      }

      return result;
    } catch (err) {
      console.error(err);
    }
  },

  territories: async (root, args) => {
    try {
      let result;
      if ((args && args.congId) || (root && root.id)) {
        result = await terrAsync.getTerritories(args.congId || root.id);
      }

      if (args.keyword) {
        result = await terrAsync.searchTerritories(args.keyword);
      }

      if (args.city) {
        result = await terrAsync.getTerritoriesByCity(args.city);
      }

      return result;

    } catch (err) {
      console.error(err);
    }
  },
};
