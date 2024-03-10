const fs = require('fs');

const childProcess = require('child_process');
const os = require('os');

const logFileName = './src/logs/activityMonitor.log';
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

function execProcess(command) {
    let result = [];
    const stdout = childProcess.execSync(command);
    result = stdout.toString().split('\r\n');
    console.log(result);
    return result;
}

function programUses() {
    const currOS = os.platform();
    const COMMANDS = {
        win32: 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name , $_.CPU , $_.WorkingSet }"',
        darwin: 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1',
        linux: 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1',
    };

    return execProcess(COMMANDS[currOS]);
}

//Refresh rate is ten times per second
/* setInterval(() => {
    const unixTime = Math.floor(new Date().getTime() / 1000);
    const processSys = programUses();
    const logItem = `${unixTime} : ${processSys.join(' ')} \n`;
    console.clear();
    console.log(logItem);
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
