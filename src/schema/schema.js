import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Address, queries as addressQueries, resolvers as addressResolvers } from './types/Address';
import { Congregation, queries as congregationQueries, resolvers as congregationResolvers } from './types/Congregation';
import { Territory, queries as territoryQueries, resolvers as territoryResolvers } from './types/Territory';
import { Publisher, queries as publisherQueries, resolvers as publisherResolvers } from './types/Publisher';


const RootQuery = `
  type RootQuery {
    publisher(firstname: String, lastname: String): Publisher
    ${publisherQueries}
    ${congregationQueries}
    ${territoryQueries}
    ${addressQueries}
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
    publisherResolvers,
    congregationResolvers,
    territoryResolvers,
    addressResolvers
  ),
  
  // Publisher: publisherResolvers,

  Congregation: {
    territories: territoryResolvers.territories,
  },

  Territory: {
    addresses: addressResolvers.addresses,
  },

  Address: {
    territory: territoryResolvers.territory
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
