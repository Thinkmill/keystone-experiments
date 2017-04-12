import { post, get } from './decorators';
import { Router } from 'express';

export default (types, injection) => {
	const routes = [];
	const decorators = {
		post: post(routes, injection),
		get: get(routes, injection)
	};

	// requireDir gives us a map
	const typesArray = Object.keys(types).reduce((acc, key) => {
		return [...acc, types[key].default];
	}, []);

	typesArray.forEach(t => t({ decorators }));

	const expressRoutes = new Router();
	console.log('Mounting Routes \n', routes);
	routes.forEach(route => {
		expressRoutes[route.method.toLowerCase()](route.path, route.handler);
	});

	return expressRoutes;
};
