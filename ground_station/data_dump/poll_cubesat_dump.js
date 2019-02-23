/*************
 * Watches for CubeSat dump, and sends outgoing POST to application server with dump contents.
 * Also copies file to an external location as a backup.
 *************/
var path = require('path');
var fs = require('fs');
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
var http = require('http');
var logger = require('../logger');

const DUMP_DIR = '/home/dzagar/Desktop/dumptest';
const WATCH_DIR = '/home/dzagar/Desktop/watchtest';

var callback = function(event) {
    var mask = event.mask;
    var type = '';
    if (event.name) {
        type += event.name;
    } else {
        type += 'n/a';
    }
	var srcFilePath = path.join(WATCH_DIR, type);

    if (mask & Inotify.IN_ISDIR) {
	logger.log('info', 'Watch directory accessed.');
        return;
    }
    if (mask & Inotify.IN_CLOSE_WRITE) {
        logger.log('debug', `Received created event ${type}`);
        var date = new Date();
		var dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        subDirPath = path.join(DUMP_DIR, dateString);
        if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath);
        }
		destPath = path.join(subDirPath, path.basename(type));
        fs.copyFile(srcFilePath, destPath, (err) => {
            if (err) throw err;
            logger.log('debug', `Copy from ${srcFilePath} to ${destPath} successful`);
        });

		var options = {
			host: "127.0.0.1",
			port: "3000",
			path: "/cubesat_dump",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer token",
				"Access-Control-Allow-Origin": "*"
			}
		};
		var jsonDump = fs.readFileSync(srcFilePath);
		var fwdReq = http.request(options, res => {
        	var respStr = "";
			res.on('error', err => {
				logger.log('error', err);
				console.log(err);
			});
			res.on('data', data => {
				respStr += data;
			});
			res.on('end', () => {
				console.log(respStr);
				logger.log('info', respStr);
				if (!res.complete) {
					logger.log('warn', `Request was not fully completed: returned ${res.statusCode}`);
					console.log(`Request was not fully completed: returned ${res.statusCode}`);
				}
			});
        });
		fwdReq.on('error', err => {
			logger.log('error', err);
			console.log(err);
		});
		fwdReq.write(jsonDump);
        fwdReq.end();
    }
}

var watch_dir = {
    path: WATCH_DIR,
    callback: callback
};

var watch_descriptor = inotify.addWatch(watch_dir);
