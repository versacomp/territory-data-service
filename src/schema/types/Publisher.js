import { PublisherAsync } from './../../async/publishers';

export const Publisher = `
  type Publisher {
    id: Int!
    congregationid: Int!
    firstname: String
    lastname: String
    congregation: Congregation
  }
`;

export const queries = `
  publisher(firstname: String, lastname: String): Publisher
`;

export const resolvers = {
  publisher: async (root, args) => {
    try {
      const publisherAsync = new PublisherAsync();
      const result = await publisherAsync.getPublisherByName(args.firstname, args.lastname);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};