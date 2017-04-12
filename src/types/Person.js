import uuid from 'uuid/v4';

export default ({ decorators: { post, get } }) => {

	return class Person {
		@post()
		static async post(_, args, context) {
			const data = {
				name: args.name,
				age: args.age
			};
			const id = uuid();

			await context.leveldb.put(id, data);

			return { id, ...data };
		}

		@get(':id')
		static async getById(_, args, context) {
			return context.leveldb.get(args.id);
		}

		@get(':id/birthday')
		static async getBirthday(_, args, context) {
			return Promise.resolve(new Date());
		}
	}
}
