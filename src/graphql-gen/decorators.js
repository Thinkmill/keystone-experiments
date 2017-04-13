// @flow
// not sure what to use these for yet
export const get = () => () => () => {};
export const post = () => () => () => {};

// default keystone methods
const methods = {
  get: typeName => `${methodNames['get'](typeName)}(id: String!): ${typeName}`,
  getAll: typeName => `${methodNames['getAll'](typeName)}: [${typeName}]`,
  create: typeName => `${methodNames['create'](typeName)}(data: In${typeName}!): ${typeName}`,
  update: typeName => `${methodNames['update'](typeName)}(data: ${typeName}!): ${typeName}`,
  delete: typeName => `${methodNames['delete'](typeName)}(id: String!): boolean`
}

const methodNames = {
  get: typeName => `get${typeName}`,
  getAll: typeName => `${typeName}s`,
  create: typeName => `create${typeName}`,
  update: typeName => `update${typeName}`,
  delete: typeName => `delete${typeName}`
}

const defaultQueries = [ 'get', 'getAll' ];
const defaultMutations = [ 'create', 'update', 'delete' ];

export const graphql = (schemas : Array<string>, queries: Array<string>, mutations: Array<string>, resolvers: Object) =>
    (target: Object) => {
        const className = target.name.toString();
        schemas.push({
            name: className,
            schema: target.schema
        });

        const keys = Object.getOwnPropertyNames(target);
        console.log('keys', keys);
        const defaultQueriesOnModel = keys.filter(k => {
          // console.log('method', );
          return defaultQueries.includes(k)
        });
        const defaultMutationsOnModel = keys.filter(k => defaultMutations.includes(k));

        // we will need to run all of the decorators collecting information then do this logic in the index.js file
        defaultQueriesOnModel.forEach(query => {
          const queryMethodName = methodNames[query](className);
          queries.push(methods[query](className));
          resolvers.RootQueries = {
            ...resolvers.RootQueries,
            [queryMethodName]: target[query]
          };
        });

        defaultMutationsOnModel.forEach(mutation => {
          const mutationMethodName = methodNames[mutation](className);
          mutations.push(methods[mutation](className));
          resolvers.RootMutations = {
            ...resolvers.RootMutations,
            [mutationMethodName]: target[mutation]
          };
        });

        // iterate through schema and match functions that equal the name of a schema field
        // adding them to the resolvers
    };
