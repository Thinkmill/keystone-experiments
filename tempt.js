// @flow
const graphql = function (target, value, descriptor) {
    console.log('TARGET', target.name.toString());
    console.log('VALUE', value);
    console.log('DESCRIPTOR', descriptor);
    console.log(arguments);

    console.log('SCHEMA', target.schema());
    console.log('GETALL', target.getAll());
    console.log('GET', target.get());
};

class Postgres {
    static async getAll () {
        return await Promise.resolve(['test']);
    }
    static async get () {
        return await Promise.resolve('test');
    }
}

interface Model<T> {
    get(): T
}

@graphql class MyModel extends Postgres implements Model<MyModel> {
    static schema = () => ({
        hi: 123
    });
}

// async function test () {
// 	// const res = await ru/nMe();
// 	// console.log(res);
// 	// console.log(g());
// }
//
// test();
