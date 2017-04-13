// @flow
import uuid from 'uuid/v4';
import { Int } from '../schema-types';

type Decorators = {
  get: Function,
  post: Function,
  graphql: Function
};


export default ({ decorators: { post, get, graphql } }: Decorators) => {
    // look for naming convention
    // @rest() // look for naming convention
    @graphql
    class Car {
        static schema = {
            id: { type: String, required: true },
            model: { type: String, required: true },
            make: { type: String, required: true }
        };
        @post()
        static async create (_, args, context) {
            const data = {
                model: args.model,
                make: args.make,
                type: 'Car'
            };
            const id = uuid();

            await context.leveldb.put(id, data);

            return { id, ...data };
        }
        @get(':id')
        static async get (_, args, context) {
            const result = await context.leveldb.get(args.id);
            if (result.type === 'Car') {
              return result;
            }
            return null;
        }

        @get(':id/birthday')
        static async getBirthday (_, args, context) {
            return Promise.resolve(new Date());
        }
    }

    return Car;
};
