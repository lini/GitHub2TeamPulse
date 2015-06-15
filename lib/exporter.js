'use strict';
var users = {
    gituser: 'TeamPulse User'
};

function _hasLabel(itemLabels, labelName) {
    if (!itemLabels || !itemLabels.length) {
        return false;
    }

    for (var i = itemLabels.length - 1; i >= 0; i--) {
        if (itemLabels[i].name === labelName) {
            return true;
        }
    }

    return false;
}

// function _formatDate(dateStr) {
//     var date = new Date(dateStr);
//     return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
// }

function generateCSV(jsonData, callback) {
    var csvData = '"Name","Assigned To","Area","Type","Priority Class","Severity","Blocking","Description","Release"\n';
    for (var i = jsonData.length - 1; i >= 0; i--) {
        var item = jsonData[i],
            record = '';
        //Name
        record += '"' + item.title.replace(/"/g, '""') + '",';
        // //Status
        // record += '"';
        // if (item.state === 'open') {
        //     if (_hasLabel(item.labels, 's:InProgress')) {
        //         record += 'In Progress';
        //     } else {
        //         record += 'Not Done';
        //     }
        // } else {
        //     record += 'Done';
        // }
        // record += '",';
        //Assigned To
        if (item.assignee && item.assignee.login) {
            record += '"' + (users[item.assignee.login] || item.assignee.login) + '",';
            if (!users[item.assignee.login]) {
                console.log('Unknown user:' + item.assignee.login);
            }
        } else {
            record += ',';
        }
        //Area
        record += '"ScreenBuilder",';
        //Type && Severity && Blocking && Priority
        if (_hasLabel(item.labels, 'Bug')) {
            record += '"Bug",';
            record += ',"';
            if (_hasLabel(item.labels, 'Blocking')) {
                record += '1 - Critical","Yes';
            } else if (_hasLabel(item.labels, 'Critical')) {
                record += '1 - Critical","No';
            } else if (_hasLabel(item.labels, 'High')) {
                record += '2 - High","No';
            } else if (_hasLabel(item.labels, 'Medium')) {
                record += '3 - Medium","No';
            } else {
                //default severity
                record += '4 - Low","No';
            }
            record += '",';
        } else {
            record += '"Story",';
            record += '"';
            if (_hasLabel(item.labels, 'Blocking')) {
                record += '1 - Must Have';
            } else if (_hasLabel(item.labels, 'Critical')) {
                record += '1 - Must Have';
            } else if (_hasLabel(item.labels, 'High')) {
                record += '2 - Should Have';
            } else if (_hasLabel(item.labels, 'Medium')) {
                record += '3 - Could Have';
            } else if (_hasLabel(item.labels, 'Low')) {
                record += '3 - Could Have';
            } else {
                //default priority
                record += '3 - Could Have';
            }
            record += '",,,';
        }
        //Description
        record += '"';
        if (item.body) {
            record += item.body.replace(/"/g, '""');
        }
        record += '\n ' + item.html_url;
        record += '",';
        // //Created On
        // record += '"' + _formatDate(item.created_at) + '",';
        // //Last Modified
        // record += '"' + _formatDate(item.updated_at) + '",';
        //Release
        if (item.milestone) {
            record += '"' + item.milestone.title.replace(/"/g, '""') + '",';
        }

        csvData += record + '\n';
    }
    callback(null, csvData);
}

module.exports.generateCSV = generateCSV;
