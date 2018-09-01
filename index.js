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
import mysql from 'mysql';
import { promisify } from 'util';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './src/schema/schema';
import http from 'http';
import https from 'https';
import fs from 'fs';

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.TERRITORY_PORT || 4000;
const PORT_SSL = process.env.TERRITORY_PORT_TLS || 4443;

const app = express();

export const conn = mysql.createConnection({
  ssl: { rejectUnauthorized: false }, // TODO: add SSL certificate file here (see https://github.com/mysqljs/mysql#ssl-options)
  host: process.env.TERRITORY_SERVER,
  user: process.env.TERRITORY_USERID,
  password: process.env.TERRITORY_PASSWORD,
  database: 'territory'
});

conn.query = promisify(conn.query);

conn.connect((err) => {
  if (err) {
    console.error('Unable to connect to database');
  } else {
    console.log('Connected to Territory database');
  }
});

app.use(cors());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, cacheControl: true }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

if (NODE_ENV === 'production') {
  const PRIVATE_KEY_FILE = process.env.PRIVATE_KEY_FILE || '';
  const CERT_FILE = process.env.CERTIFICATE_FILE || '';
  const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_FILE, 'utf8');
  const CERT = fs.readFileSync(CERT_FILE, 'utf8');
  const CREDENTIALS = {key: PRIVATE_KEY, cert: CERT};

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(CREDENTIALS, app);

  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  httpsServer.listen(PORT_SSL, () => {
    console.log(`Listening on port ${PORT_SSL}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
