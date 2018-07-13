import addressAsync from './../../async/addresses';

export const Address = `
  type Address {
    id: Int!
    congregationId: Int!
    territoryId: Int
    addr1: String
    addr2: String
    city: String
    state: String
    postalCode: String
    phone: String
    longitude: Float
    latitude: Float
  }
`;

export const queries = `
  address(id: Int): Address
  addresses(terrId: Int, keyword: String): [Address]
`;

export const resolvers = {
  address: async (root, args) => {
    try {
      return await addressAsync.getAddress(args.id);
    } catch (err) {
      console.error(err);
    }
  },

  addresses: async (root, args) => {
    try {
      let result;
      if ((args && args.terrId) || (root && root.id)) {
        result = await addressAsync.getAddressesByTerritory(args.terrId || root.id);
      }

      if (args.keyword) {
        result = await addressAsync.searchAddresses(args.keyword);
      }

      return result;

    } catch (err) {
      console.error(err);
    }
  },
};

