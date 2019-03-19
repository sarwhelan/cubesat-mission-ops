/**
 * Watches for CubeSat dump, and sends outgoing POST to the application server with 
 * dump contents.
 * Also copies file to an external location as a backup.
 */

/**
 * Node modules required.
 */
const path = require('path');
const fs = require('fs');
const Inotify = require('inotify').Inotify;
const inotify = new Inotify();
const http = require('http');

/**
 * Internal imports.
 */
const logger = require('../logger');
const constants = require('../constants');

/**
 * Action to perform on filesystem event.
 * @param {any} event The filesystem event that occurred.
 */
var callback = function(event) {
	// Get the event mask to determine which event happened.
	// For more details on this, see the Inotify documentation: https://www.npmjs.com/package/inotify
    var mask = event.mask;
    var type = '';
    if (event.name) {
        type += event.name;
    } else {
        type += 'n/a';
	}
	
	var srcFilePath = path.join(constants.DATA_DUMP_WATCH_DIR, type);

	// Watch directory has been accessed; log and return.
    if (mask & Inotify.IN_ISDIR) {
		logger.log('info', 'Watch directory accessed.');
        return;
	}
	// File is done writing; save a backup and send it in a POST.
    if (mask & Inotify.IN_CLOSE_WRITE) {
		logger.log('debug', `Received created event ${type}`);
		
		// Back up in a directory defined by the current datetime.
        var date = new Date();
		var dateString = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
        subDirPath = path.join(constants.DATA_DUMP_BACKUP_DIR, dateString);
		// Make the directory if it doesn't exist already.
		if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath);
        }
		destPath = path.join(subDirPath, path.basename(type));
        fs.copyFile(srcFilePath, destPath, (err) => {
            if (err) throw err;
            logger.log('debug', `Copy from ${srcFilePath} to ${destPath} successful`);
        });

		// Send outgoing POST with dump data to app server.
		var options = {
			host: constants.APP_SERVER_HOST,
			port: "3000",
			path: "/cubesat_dump",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer token",
				"Access-Control-Allow-Origin": "*"
			}
		};
		// Read JSON data dump from the recently received data dump.
		var jsonDump = fs.readFileSync(srcFilePath, 'utf-8');
		var fwdReq = http.request(options, res => {
        	var respStr = "";
			res.on('error', err => {
				logger.log('error', err);
			});
			res.on('data', data => {
				respStr += data;
			});
			res.on('end', () => {
				logger.log('info', respStr);
				if (!res.complete) {
					logger.log('warn', `Request was not fully completed: returned ${res.statusCode}`);
				}
			});
        });
		fwdReq.on('error', err => {
			logger.log('error', err);
		});
		// Send outgoing POST.
		fwdReq.write(jsonDump);
        fwdReq.end();
    }
}

// Initialize the directory to watch and the action to take on a filesystem event.
var watch_dir = {
    path: constants.DATA_DUMP_WATCH_DIR,
    callback: callback
};

// Add watch to the watch directory defined above.
var watch_descriptor = inotify.addWatch(watch_dir);
