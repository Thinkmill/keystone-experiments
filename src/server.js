import express from 'express';
import bodyParser from 'body-parser';
import requireDir from 'require-directory';
import { getRoutes } from './api-gen';

const app = express();
app.use(bodyParser());

const types = requireDir(module, './types');

app.use(getRoutes(types));

app.listen(3000, () => {
	console.log('Auto generated api serving on port', 3000)
});
