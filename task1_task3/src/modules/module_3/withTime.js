const MyEventEmitter = require('./eventEmitterClass');

class WithTime extends MyEventEmitter {
    constructor() {
        super();
    }

    async execute(asyncFunc, ...args) {
        withTime.emit('begin');
        const start = Date.now();
        const url = args[0];
        await asyncFunc(url);
        const end = Date.now();
        const duration = end - start;
        console.log(`Execute of asyncFunc takes ${duration} milliseconds`);
        withTime.emit('end');
    }
}

async function fetchFromUrl(url) {
    let response = await fetch(url)
        .then((response) => response.json())
        .then((result) => result);
    console.log('response', response);
    return response;
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners('end'));
