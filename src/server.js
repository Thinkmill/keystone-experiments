import express from 'express';
import bodyParser from 'body-parser';
import requireDir from 'require-directory';
import { getRoutes } from './api-gen';
import leveldb from './leveldb';

const app = express();
app.use(bodyParser.json());

const types = requireDir(module, './types');

const injection = () => ({
	leveldb: leveldb({ db: 'testdb' })
})

app.use(getRoutes(types, injection()));

app.listen(3000, () => {
	console.log('Auto generated api serving on port', 3000)
});
