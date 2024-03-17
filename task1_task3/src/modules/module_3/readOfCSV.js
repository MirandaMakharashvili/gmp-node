const csv = require('csvtojson');
const fs = require('fs');
const csvFilePath = '../../../csv/nodejs.csv';
const csvFileContent = './src/csv/csvFileContent.txt';

csv({ output: 'csv' })
    .fromFile(__dirname + csvFilePath)
    .subscribe((item) => {
        writeToFile(item);
    });

function writeToFile(item) {
    const [Book, Author, Amount, Price] = item;
    const line = `{ "Book": ${Book}, "Author": ${Author}, "Amount": ${Amount}, "Price": ${Price}, }\n`;

    fs.appendFile(csvFileContent, line, (err) => {
        if (err) console.error(`error: ${error}`);
    });
}