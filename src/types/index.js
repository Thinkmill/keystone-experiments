export default ({ decorators: { post, get } }) => {

	return class MyType {
		@post()
		static async create() {
			return await Promise.resolve('test');
		}

		@get()
		static async get(dataAccess) {

			return await Promise.resolve('test');
		}
	}
}
