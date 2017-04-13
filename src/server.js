import express from 'express';
import bodyParser from 'body-parser';
import requireDir from 'require-directory';
import { getRoutes } from './api-gen';
import leveldb from './leveldb';
import graphQlServer from './graphql-gen';

const app = express();
app.use(bodyParser.json());

const types = requireDir(module, './types');

const injection = () => ({
    leveldb: leveldb({ db: 'testdb' })
});

const context = injection();

app.use(getRoutes(types, context));

app.use(graphQlServer(types, context));

app.listen(3000, () => {
    console.log('Auto generated api serving on port', 3000);
});
