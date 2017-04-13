import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { post, get, graphql } from './decorators';
import { Router } from 'express';
import { makeExecutableSchema } from 'graphql-tools';

export default (types, context) => {
    const routes = new Router();
    const schema = getSchema(types, context);

    routes.use('/graphql', graphqlExpress({ schema, context }));

    routes.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql'
        })
    );

    console.log('Mounted GraphQlServer');

    return routes;
};

const getSchema = (types, context) => {
    const schemas = [];
    const queries = [];
    const mutations = [];
    const resolvers = {
      RootQueries: {},
      RootMutations: {},
    }

    const decorators = {
        post: post(schemas, context),
        get: get(schemas, context),
        graphql: graphql(schemas, queries, mutations, resolvers)
    };

    const typesArray = Object.keys(types).reduce(
        (acc, key) => {
            return [...acc, types[key].default];
        },
        []
    );

    typesArray.forEach(t => t({ decorators }));

    const schemasAsGraphQl = schemas.map(transformTypeToGraphQl);
    const queriesAsGraphQl = transformQueryToGraphQl(queries);
    const mutationsAsGraphQl = transformMutationsToGraphQl(mutations);

    // console.log('root', rootSchema(queriesAsGraphQl, mutationsAsGraphQl, schemaDefinition(queriesAsGraphQl, mutationsAsGraphQl)));
    return makeExecutableSchema({
        typeDefs: [
          ...schemasAsGraphQl,
          rootSchema(queriesAsGraphQl, mutationsAsGraphQl, schemaDefinition(queries, mutations))
        ],
        resolvers: resolvers
    });
};

const transformQueryToGraphQl = queries => {
    if (!queries.length) return '';
    return `
			type RootQueries {
				${queries.reduce((acc, q) => `${acc}${q}\n`, '')}
			}
		`;
};

const transformMutationsToGraphQl = mutations => {
    if (!mutations.length) return '';

    return `
		type RootMutations {
			${mutations.reduce((acc, q) => `${acc}${q}\n`, '')}
		}
	`;
};

const rootSchema = (queries, mutations, definition) => {
    return `
		${queries}
		${mutations}
		${definition}
	`;
};

const schemaDefinition = (queries, mutations) => {
    let body = '';
    if (queries) body += 'query: RootQueries\n';
    if (mutations) body += 'mutation: RootMutations\n';

    return `
		schema {
			${body}
		}
	`;
};

const transformTypeToGraphQl = typeSchema => {
    const typeName = typeSchema.name;
    const typeNameLower = typeName.toLowerCase();
    const typeNameLowerPlural = `${typeNameLower}s`;
    const outType = typeSchema.name;
    const inType = `In${typeName}`;
    const outProperties = Object.keys(typeSchema.schema).map(transformFieldToGraphQl(typeSchema.schema));
    const inProperties = Object.keys(typeSchema.schema).filter(k => k !== 'id').map(transformFieldToGraphQl(typeSchema.schema));

    const schema = `
		type ${outType} {
			${outProperties.reduce((acc, prop) => `${acc}${prop}\n`, '')}
		}
		input ${inType} {
			${inProperties.filter(prop => prop !== 'id').reduce((acc, prop) => `${acc}${prop}\n`, '')}
		}
	`;

    return schema;
};

const transformFieldToGraphQl = parent =>
    k => {
        const prop = parent[k];
        return `${k}: ${prop.type.name.toString()}${prop.required ? '!' : ''}`;
    };
