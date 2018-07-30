import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Address, queries as addressQueries, resolvers as addressResolvers } from './types/Address';
import { Congregation, queries as congregationQueries, resolvers as congregationResolvers } from './types/Congregation';
import { 
  Territory, 
  queries as territoryQueries, 
  mutations as territoryMutations, 
  queryResolvers as territoryQueryResolvers, 
  mutationResolvers as territoryMutationResolvers 
} from './types/Territory';
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

const Mutation = `
  type Mutation {
    ${territoryMutations}
  }
`;


const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

const resolvers = {
  RootQuery: merge (
    {}, 
    publisherResolvers,
    congregationResolvers,
    territoryQueryResolvers,
    addressResolvers
  ),

  Mutation: {
    checkoutTerritory: territoryMutationResolvers.checkoutTerritory,
    checkinTerritory: territoryMutationResolvers.checkinTerritory
  },

  // Publisher: publisherResolvers,

  Congregation: {
    territories: territoryQueryResolvers.territories,
  },

  Territory: {
    addresses: addressResolvers.addresses,
    status: territoryQueryResolvers.status,
  },

  Address: {
    territory: territoryQueryResolvers.territory
  },
}

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQuery,
    Mutation,
    Congregation,
    Territory,
    Publisher,
    Address,
  ],
  resolvers
});
