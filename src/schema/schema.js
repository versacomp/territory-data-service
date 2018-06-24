import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Address } from './types/Address';
import { Congregation, queries as congregationQueries, resolvers as congregationResolvers } from './types/Congregation';
import { Territory, queries as territoryQueries, resolvers as territoryResolvers } from './types/Territory';
import { Publisher, queries as publisherQueries, resolvers as publisherResolvers } from './types/Publisher';

const RootQuery = `
  type RootQuery {
    ${publisherQueries}
    ${congregationQueries}
    ${territoryQueries}
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

const resolvers = {
  RootQuery: merge (
    {}, 
    {
      publisher: publisherResolvers.publisher,
    }
  ),
  
  Publisher: {
    congregation: congregationResolvers.congregation
  },

  Congregation: {
    territories: territoryResolvers.territories,
  },
}

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQuery,
    Congregation,
    Territory,
    Publisher,
    Address,
  ],
  resolvers
});
