import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import { graphqlExpress } from 'apollo-server-express';
// import { schema } from './schema/schema';

const conn = mysql.createConnection({
  ssl: { rejectUnauthorized: false }, // TODO: add SSL certificate file here (see https://github.com/mysqljs/mysql#ssl-options)
  host: process.env.TERRITORY_SERVER,
  user: process.env.TERRITORY_USERID,
  password: process.env.TERRITORY_PASSWORD,
  database: 'territory'
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to Territory database');
});

const PORT = 4000;
const app = express();

// bodyParser is needed just for POST.
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.listen(PORT);