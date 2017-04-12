let runMe;

const decorators = t => ({
	get: (target, value, descriptor) => {
		runMe = descriptor.value;
	}
})
const get = decorators('MyTest').get;

class MyTest {
	@get
	static async get() {
		return await Promise.resolve('test');
	}
}

async function test () {
	const res = await runMe();
	console.log(res);
}

test();
