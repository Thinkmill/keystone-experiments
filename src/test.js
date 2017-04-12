let runMe;
let g;

const get = (target, value, descriptor) => {
	runMe = descriptor.value;
}
const gg = (target, value, descriptor) => {
	g = descriptor.initializer()
}

class MyTest {
	@gg
	static t = () => ({
		hi: 123
	});

	@get
	static async get() {
		return await Promise.resolve('test');
	}
}

async function test () {
	// const res = await ru/nMe();
	// console.log(res);
	console.log(g());
}

test();
