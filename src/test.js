// @flow
const graphql = function (target, value, descriptor) {
    console.log('TARGET', target.name.toString());
    console.log('SCHEMA', target.schema);
    console.log('GETALL', target.getAll());
    console.log('GET', target.get());
};

const graphQl = Model => {
    console.log('TARGET', Model.name.toString());
    console.log('SCHEMA', Model.schema);
    console.log('GETALL', Model.getAll());
    console.log('GET', Model.get());
    return Model;
};

class Postgres {
    static async getAll () {
        return await Promise.resolve(['test']);
    }
    static async get () {
        return await Promise.resolve();
    }
}
@graphql
class MyModel extends Postgres {
    static schema = {
        hi: 123
    };
}

// to walk via prototype
console.log(Object.getOwnPropertyNames(MyModel));
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(MyModel)));

// graphQl(MyModel);
