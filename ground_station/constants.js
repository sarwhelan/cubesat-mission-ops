/*
* Defining constants.
*/
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

/*
* Server constants.
*/
define("PORT", 3700);
if (process.env.NODE_ENV == 'production') {
    define("APP_SERVER_HOST", '10.0.0.81');
}

/*
* Data dump constants.
*/
define("DATA_DUMP_BACKUP_DIR", '/home/dzagar/Desktop/dumptest');
define("DATA_DUMP_WATCH_DIR", "/home/dzagar/Desktop/watchtest");

/*
* Queue path constants.
*/
if (process.env.NODE_ENV !== 'production') {
    define("CURR_QUEUE_DIR", `${__dirname}/test/queue/`);
	define("QUEUE_BACKUP_DIR", `${__dirname}/test/queue/queuedumptest`);
}
else {
    define("CURR_QUEUE_DIR", "/home/dzagar/Desktop/queue/");
    define("QUEUE_BACKUP_DIR", "/home/dzagar/Desktop/queuedumptest");
}

/**
 * Queue filename.
 */
define("QUEUE_FILE", "queue.json");
