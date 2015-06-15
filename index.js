'use strict';

var fs = require('fs'),
    downloader = require('./lib/downloader'),
    exporter = require('./lib/exporter');

function saveOutput(err, csvData) {
    fs.writeFile('export.csv', csvData, function (err) {
        if (err) {
            return console.log('Cannot write export.csv: ' + (err && err.message));
        }

        console.log('Done!');
    });
}

function downloadIssues(url) {
    downloader.getIssues(url, function (err, issuesData) {
        if (err || !issuesData) {
            return console.log('Cannot download GitHub issues: ' + (err && err.message));
        }

        fs.writeFile('import.json', issuesData, function (errWrite) {
            if (errWrite) {
                return console.log('Cannot write import.json: ' + (errWrite && errWrite.message));
            }

            console.log('Done!');
        });
    });
}

function getArgs() {
    var argv = process.argv,
        file;
    if (!argv || !argv.length || argv.length < 3) {
        return console.log('Please pass an argument: URL or .json file');
    }

    file = argv[2];
    if (!file || !file.length) {
        return console.log('Invalid Argument!');
    }

    if (file.indexOf('http://') === 0 || file.indexOf('https://') === 0) {
        downloadIssues(file);
    } else {
        fs.readFile(file, {
            encoding: 'utf8'
        }, function (err, data) {
            if (err) {
                return console.log('Cannot open file: ' + (err && err.message));
            }
            var jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (e) {
                return console.log('File is not valid JSON: ' + (e && e.message));
            }

            exporter.generateCSV(jsonData, saveOutput);
        });
    }
}

getArgs();
