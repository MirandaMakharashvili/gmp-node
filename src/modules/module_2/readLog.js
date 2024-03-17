const fs = require('fs');
const { stdout } = require('node:process');

const logFileName = './src/logs/activityMonitor.log';

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

function createFile(filename) {
    fs.open(filename, 'r', function (err) {
        if (err) {
            fs.writeFile(filename, '', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('The file was saved!');
            });
        } else {
            console.log('The file exists!');
        }
    });
}

async function readLog() {
    const logData = fs.readFileSync(logFileName).toString('UTF8').split('\n');

    if (logData.length) {        
        for (const logItem of logData.entries()) {
            await timer(500);
            stdout.clearLine(0);
            stdout.cursorTo(0);
            stdout.write(`${logItem}`);
        }
    } else {
        console.error('There was and problem while reading log file');
    }
}

createFile(logFileName);

setTimeout(() => {
    readLog();
}, 1000);
