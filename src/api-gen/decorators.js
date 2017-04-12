const GET = 'GET'
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const OPTIONS = 'OPTIONS';

const HTTP_VERBS = [GET, POST, PUT, DELETE, OPTIONS];

const postHandler = fn => {
	return async function (req, res, next) {
		const result = await fn(req.body);
		res.send(result);
	}
}

const wrapper = addToRoutes => routes => name => (target, key, descriptor) => {
	const isVerb = HTTP_VERBS.includes(key.toUpperCase());
	const action = isVerb ? '' : name ? name : key;
	const base = target.name.toLowerCase();
	const fn = descriptor.value;
	addToRoutes({ routes, action, base, fn });
};

export const post = wrapper(({ routes, action, base, fn }) =>
	routes.push({
		method: POST,
		path: `/${base}/${action}`,
		handler: postHandler(fn)
	})
);


const getHandler = fn => {
	return async function (req, res, next) {
		const result = await fn({...req.query, ...req.params });
		res.send(result);
	}
}

export const get = wrapper(({ routes, action, base, fn }) =>
	routes.push({
		method: GET,
		path: `/${base}/${action}`,
		handler: getHandler(fn)
	})
);
