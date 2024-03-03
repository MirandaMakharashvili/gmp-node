const fs = require('fs');

const childProcess = require('child_process');
const os = require('os');

const logFileName = './src/logs/activityMonitor.log';
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

function execProcess(command) {
    let result = [];

    childProcess.exec(command, { timeout: 5 * 1000 }, (err, stdout) => {
        if (err) {
            console.log(`error: ${err}`);
            return;
        }

        const lines = stdout.toString().split('\r\n');

        lines.forEach(function (line) {
            let lineItem = line;
            result.push(lineItem);
        });
    });

    return result;
}

function programUses() {
    const currOS = os.platform();
    let result = [];

    if (currOS === 'win32') {
        result = execProcess(
            'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name , $_.CPU , $_.WorkingSet }"',
        );
    }

    if (currOS === 'darwin') {
        result = execProcess('ps -A -o %cpu,%mem,comm | sort -nr | head -n 1');
    }

    if (currOS === 'linux') {
        result = execProcess('ps -A -o %cpu,%mem,comm | sort -nr | head -n 1');
    }

    return result;
}

//Refresh rate is ten times per second
/* setInterval(() => {
    programUses();
}, 100); */

async function writeLog() {
    const unixTime = Math.floor(new Date().getTime() / 1000);
    const processSys = programUses();
    await timer(5000);
    const logItem = `${unixTime} : ${processSys.join(' ')} \n`;

    fs.appendFile(logFileName, logItem, (err) => {
        if (err) console.error(`error: ${error}`);
    });
}

writeLog();

setInterval(() => {
    writeLog();
}, 60 * 1000);
