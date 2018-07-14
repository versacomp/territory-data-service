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
    city: String
  }
`;

export const queries = `
  territory(id: Int): Territory
  territories(congId: Int, keyword: String, city: String, group_code: String): [Territory]
  territoriesByCity(congId: Int): [Territory]
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
      if (root && root.id && args.keyword) {
        return await terrAsync.searchTerritories(root.id, args.keyword);
      }

      if (root && root.id && args.city) {
        return await terrAsync.getTerritoriesByCity(root.id, args.city);
      }

      if (args && args.congId && args.group_code) {
        return await terrAsync.getTerritoriesByGroupCode(args.congId, args.group_code);
      }

      if ((args && args.congId) || (root && root.id)) {
        return await terrAsync.getTerritories(args.congId || root.id);
      }

    } catch (err) {
      console.error(err);
    }
  },

  territoriesByCity: async(root, args) => {
    try {
      if (args.congId) {
        return await terrAsync.getTerritoriesByCity(args.congId);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
