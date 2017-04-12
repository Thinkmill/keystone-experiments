import { post, get, graphql } from './decorators';

export default (types, context) => {
	const schemas = [];
	const decorators = {
		post: post(schemas, context),
		get: get(schemas, context),
		graphql: graphql(schemas),
	};

	// const typesArray = Object.keys(types).reduce((acc, key) => {
	// 	return [...acc, { name: key, ...types[key].default }];
	// }, []);

	// const schemas = typesArray.reduce(
	// 	(acc, type) => {
	// 		if (!type.schema) return acc;
	// 		return [{ name: type.name, schema: type.schema }, ...acc];
	// 	},
	// 	[],
	// );

	const typesArray = Object.keys(types).reduce((acc, key) => {
		return [...acc, types[key].default];
	}, []);

	typesArray.forEach(t => t({ decorators }));

	console.log(schemas);

	const schemasAsGraphQl = schemas.map(transformTypeToGraphQl);

	return schemasAsGraphQl;
};

const transformTypeToGraphQl = typeSchema => {
	const outType = typeSchema.name;
	const inType = `In${typeName}`;
	const keys = Object.keys(typeSchema.schema).map(transformFieldToGraphQl(typeSchema.schema));

	const schema = `
		type ${outType} {
			${properties.reduce((acc, prop) => `${acc}${prop}`, '')}
		}
	`;

	return schema;

};

const transformFieldToGraphQl = parent => k => {
	const prop = parent[k];
	return `${k}: ${prop.type}${prop.required ? '!': ''}`;
};
