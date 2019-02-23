var path = require('path');
var fs = require('fs');
var request = require('request');
var Inotify = require('inotify').Inotify();
var inotify = new Inotify();

const DUMP_DIR = "/Users/danazagar/Documents/Cappy/dump_test";

var data = {};

var callback = function(event) {
    var mask = event.mask;
    var type = 'file';
    if (event.name) {
        type += ' ' + event.name + ' ';
    } else {
        type += ' ';
    }

    if (mask & Inotify.IN_ISDIR) {
        return;
    }
    if (mask & Inotify.IN_CREATE) {
        inotify.addWatch({
            path: type,
            watch_for: Inotify.IN_CLOSE_WRITE,
            callback: callback
        });
        console.log(`Received created event ${type}`);
        var date = new Date().getDate();
        console.log(date);
        subDirPath = path.join(DUMP_DIR, date);
        if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath);
        }
        fs.copyFile(type, path.join(subDirPath, path.basename(type)), (err) => {
            if (err) throw err;
            console.log('Copy successful');
        });
        fs.createReadStream(type)
        .pipe(
            request.post(
            "http://127.0.0.1:3700/cubesat_dump"
            ).on('error', err => {
                console.log(err);
            })
            .on('response', resp => {
                console.log(resp.statusCode);
                console.log(resp.headers['content-type']);
            })
        );
        
    }
}

var watch_dir = {
    path: '/Users/danazagar/Documents/Cappy/watch_test',
    watch_for: Inotify.IN_ALL_EVENTS,
    callback: callback
};

var watch_descriptor = inotify.addWatch(watch_dir);