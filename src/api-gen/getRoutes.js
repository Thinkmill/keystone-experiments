import routesStore from './routesStore';
import { post, get } from './decorators';
import { Router } from 'express';

export default (types) => {
	const routes = routesStore();
	const decorators = {
		post: post(routes),
		get: get(routes)
	};

	// requireDir gives us a map
	const typesArray = Object.keys(types).reduce((acc, key) => {
		return [...acc, types[key].default];
	}, []);

	typesArray.forEach(t => t({ decorators }));
	console.log(routes);
	const expressRoutes = new Router();

	routes.forEach(route => {
		expressRoutes[route.method.toLowerCase()](route.path, route.handler);
	});

	return expressRoutes;
};