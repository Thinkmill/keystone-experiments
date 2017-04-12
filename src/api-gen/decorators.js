const GET = 'GET'
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const OPTIONS = 'OPTIONS';

const HTTP_VERBS = [GET, POST, PUT, DELETE, OPTIONS];

const wrapper = addToRoutes => (routes, injection) => name => (target, key, descriptor) => {
	const isVerb = HTTP_VERBS.includes(key.toUpperCase());
	const action = isVerb ? '' : name ? name : key;
	const base = target.name.toLowerCase();

	// to support Hapi
	// if (action.startsWith(':')) {
	// 	action = `{${action.substr(0,1)}}`;
	// }


	// to map to the same as a graphql resolver we map the following over to a familiar shape
	const fn = args => descriptor.value(null, args, injection);

	addToRoutes({ routes, action, base, fn });
};

export const post = wrapper(({ routes, action, base, fn }) =>
	routes.push({
		method: POST,
		path: `/${base}/${action}`,
		handler: postHandler(fn)
	})
);

const postHandler = fn => {
	return async function (req, res, next) {
		try {
			const result = await fn({ ...req.query, ...req.params, ...req.body });
			res.send(result);
		} catch (e) {
			res.sendStatus(500);
		}
	}
}

export const get = wrapper(({ routes, action, base, fn }) =>
	routes.push({
		method: GET,
		path: `/${base}/${action}`,
		handler: getHandler(fn)
	})
);

const getHandler = fn => {
	return async function (req, res, next) {
		try {
			const result = await fn({ ...req.query, ...req.params });
			res.send(result);
		} catch (e) {
			next(e);
		}
	}
}
