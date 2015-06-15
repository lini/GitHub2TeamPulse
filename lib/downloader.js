'use strict';
var url = require('url'),
    async = require('async');

function _downloadIssueData(downloadUrl, callback) {
    var protocol = downloadUrl.indexOf('https://') === 0 ? require('https') : require('http'),
        options = url.parse(downloadUrl),
        request;

    options.method = 'GET';
    options.headers = {
        Authorization: 'token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Place your OAuth token here
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36'
    };

    request = protocol.request(options, function _reply(res) {
        var data = '';

        res.setEncoding('utf8');
        res.on('data', function _onData(chunk) {
            data += chunk;
        });

        res.on('end', function _onEnd() {
            var links = res.headers && res.headers.link && res.headers.link.split(','),
                link, urlToNext;

            if (res.statusCode !== 200) {
                return callback(new Error('error ' + res.statusCode), data);
            }

            for (var i = links.length - 1; i >= 0; i--) {
                link = links[i];
                if (link.indexOf('rel="next"') > 0 && link.indexOf('>') > 0) {
                    urlToNext = link.substring(link.indexOf('<') + 1, link.indexOf('>'));
                    break;
                }
            }

            callback(null, data, urlToNext);
        });
    }).on('error', function (err) {
        return callback(err);
    });

    request.end();
}

function getIssues(gitUrl, callback) {
    var issuesData = '',
        q = async.queue(_downloadIssueData.bind(null), 1),
        _downloadFinished = function _downloadFinished(err, resultData, urlToNext) {
            if (err) {
                callback(err, issuesData);
            } else {
                resultData = resultData.trim();
                issuesData += (issuesData ? ',' : '') + resultData.substr(1, resultData.length - 2);
            }
            if (urlToNext) {
                q.push(urlToNext, _downloadFinished.bind(null));
            }
        };

    q.drain = function _queueProcessed() {
        callback(null, '[' + issuesData + ']');
    };

    q.push(gitUrl, _downloadFinished.bind(null));
}

module.exports.getIssues = getIssues;
