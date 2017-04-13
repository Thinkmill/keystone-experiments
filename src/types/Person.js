// @flow
import uuid from 'uuid/v4';
const Int = function Int () {};

type Decorators = {
  get: Function,
  post: Function,
  graphql: Function
};


export default ({ decorators: { post, get, graphql } }: Decorators) => {
    // look for naming convention
    // @rest() // look for naming convention
    @graphql
    class Person {
        static schema = {
            id: { type: String, required: true },
            name: { type: String, required: true },
            age: { type: Int, required: true }
        };
        @post()
        static async create (_, args, context) {
            const data = {
                name: args.name,
                age: args.age
            };
            const id = uuid();

            await context.leveldb.put(id, data);

            return { id, ...data };
        }
        @get(':id')
        static async get (_, args, context) {
            return context.leveldb.get(args.id);
        }

        @get(':id/birthday')
        static async getBirthday (_, args, context) {
            return Promise.resolve(new Date());
        }
    }

    return Person;
};
