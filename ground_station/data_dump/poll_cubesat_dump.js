var path = require('path');
var fs = require('fs');
var request = require('request');
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
var http = require('http');
var logger = require('../logger');

const DUMP_DIR = '/home/dzagar/Desktop/dumptest';
const WATCH_DIR = '/home/dzagar/Desktop/watchtest';

var callback = function(event) {
    console.log('success');
    var mask = event.mask;
    var type = '';
    if (event.name) {
        type += event.name;
    } else {
        type += 'n/a';
    }
	console.log(type);
	var srcFilePath = path.join(WATCH_DIR, type);

    if (mask & Inotify.IN_ISDIR) {
        return;
    }
    if (mask & Inotify.IN_CLOSE_WRITE) {
        /*inotify.addWatch({
            path: type,
            watch_for: Inotify.IN_CLOSE_WRITE,
            callback: callback
        });*/
        console.log(`Received created event ${type}`);
        var date = new Date();
		var dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        console.log(dateString);
        subDirPath = path.join(DUMP_DIR, dateString);
        if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath);
        }
        fs.copyFile(srcFilePath, path.join(subDirPath, path.basename(type)), (err) => {
            if (err) throw err;
            console.log('Copy successful');
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
		var jsonDump = JSON.stringify(JSON.parse(fs.readFileSync(srcFilePath)));
		var fwdReq = http.request(options, res => {
        	var respStr = "";
			res.on('error', err => {
				console.log(err);
			});
			res.on('data', data => {
				respStr += data;
			});
			res.on('end', () => {
				console.log(respStr);
				if (!res.complete) {
					console.log('but why');
				}
			});
        });
		fwdReq.on('error', err => {
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
