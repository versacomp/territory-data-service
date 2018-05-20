import { makeExecutableSchema } from 'graphql-tools';
import { Address } from '@types/Address';
import { Congregation } from '@types/Congregation';
import { Publisher } from '@types/Publisher';
import { Territory } from '@types/Territory';

const RootQuery = `
  type RootQuery {
    Address(id: int!): Address
    Congregation(id: int!): Congregation
    Publisher(id: int!): Publisher
    Territory(id: int!): Territory
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQuery,
    Address,
    Congregation,
    Publisher,
    Territory
  ]
});