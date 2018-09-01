/**
 * Copyright 2018 Territory Data Service
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import { promisify } from 'util';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './src/schema/schema';
import SocksConnection from 'socksjs';

const PORT = process.env.PORT || 4000;

const app = express();

const fixieUrl = process.env.FIXIE_SOCKS_HOST;
const fixieValues = fixieUrl.split(new RegExp('[/(:\\/@)/]+'));
const db = 'territory';

const mysqlServer = {
  host: process.env.TERRITORY_SERVER,
  port: 3306
};

const fixieConnection = new SocksConnection(mysqlServer, {
  user: fixieValues[0],
  pass: fixieValues[1],
  host: fixieValues[2],
  port: fixieValues[3],
});

export const conn = mysql.createPool({
  user: process.env.TERRITORY_USERID,
  password: process.env.TERRITORY_PASSWORD,
  database: db,
  stream: fixieConnection,
  ssl  : {
    // TODO: Setup ca crt
    rejectUnauthorized: false
  }
});

conn.getConnection(function gotConnection(err, connection) {

  console.log('FixieSocks User: ' + fixieValues[0]);
  console.log('FixieSocks Pass: ' + fixieValues[1]);
  console.log('FixieSocks Host: ' + fixieValues[2]);
  console.log('FixieSocks Port: ' + fixieValues[3]);
  console.log('Territory Server: ' + process.env.TERRITORY_SERVER);
  console.log('DB user: ' + process.env.TERRITORY_USERID);
  console.log('DB pass: ' + process.env.TERRITORY_PASSWORD);

  if (err) {
    console.error('Unable to get connection to database');
    throw err;
  } 

  queryVersion(connection);
});

function queryVersion(connection) {
  connection.query('SELECT version();', function (err, rows, fields) {

      if (err) {
        console.error('Unable to connect to database');
        throw err;
      }

      console.log('Connected to Territory database');
      console.log('MySQL/MariaDB version: ', rows);
      connection.release();
      process.exit();
  });
}

conn.query = promisify(conn.query);

app.use(cors());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, cacheControl: true }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
