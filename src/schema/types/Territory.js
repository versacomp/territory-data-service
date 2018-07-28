import terrAsync from './../../async/territories';
import { isArray, orderBy, some } from 'lodash';
import { differenceInMonths } from 'date-fns';

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
    status: String
  }
`;

export const queries = `
  territory(id: Int): Territory
  territories(congId: Int, keyword: String, city: String, group_code: String): [Territory]
  territoriesByCity(congId: Int): [Territory]
  status(territoryId: Int): String
`;

export const resolvers = {
  territory: async (root, args) => {
    try {
      let result;
      if (args.id) {
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
  },

  status: async(root, args) => {
    try {
      console.log('root', root);
      console.log('args', args);
      if (root && root.congregationid && root.id) {
        let activity = await terrAsync.getTerritoryStatus(root.congregationid, root.id);
        if (activity) {
          if (!isArray(activity)) {
            return 'Available';
          }
          if (activity.length == 0) {
            return 'Available';
          }

          // re-order check in/out activity by most recent timestamp
          activity = orderBy(activity, 'timestamp', 'desc');
          // reduce array to the last two records
          activity.length = 2;

          // if there is no check IN activity, the territory is still checked out
          if (!some(activity, ['status', 'IN'])) {
            return 'Checked Out';
          }

          // if the last two activity is an IN/OUT pair...
          if (activity[0].status === 'IN' || activity[1].status === 'OUT') {

            // ... and the most recent timestamp is two months or less, then the territory is recently worked.
            if (differenceInMonths(new Date(), activity[0].timestamp) <= 2) {
              return 'Recently Worked';
            }
          }
          
          // ... otherwise the territory is available.
          return 'Available';
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
