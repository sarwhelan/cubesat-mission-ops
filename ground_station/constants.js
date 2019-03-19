/**
 * Assigns constant values.
 * @param {string} name The constant name.
 * @param {string} value The associated value with the constant.
 */
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

/**
 * Port number for the ground station server.
 */
define("PORT", 3700);

/**
 * App server IP address, only defined when running in production
 * for now.
 */
if (process.env.NODE_ENV == 'production') {
    define("APP_SERVER_HOST", '10.0.0.81');
}

/**
 * Path to backup directory where data dumps received from the CubeSat will
 * be stored.
 */
define("DATA_DUMP_BACKUP_DIR", '/media/pi/Lexar/CubeSat/data_dump');

/**
 * Path to directory where data dumps will initially be received from the
 * CubeSat.
 */
define("DATA_DUMP_WATCH_DIR", "/home/pi/Desktop/watchtest");

/**
 * Paths to 1) the directory where the queue will be picked up by the CubeSat
 * and 2) the backup directory where a copy of the queue will be stored.
 */
if (process.env.NODE_ENV !== 'production') {
    define("CURR_QUEUE_DIR", `${__dirname}/test/queue/`);
	define("QUEUE_BACKUP_DIR", `${__dirname}/test/queue/queuedumptest`);
}
else {
    define("CURR_QUEUE_DIR", "/home/pi/Desktop/queue/");
    define("QUEUE_BACKUP_DIR", "/media/pi/Lexar/CubeSat/queue/");
}

/**
 * The filename of the queue file to be saved.
 */
define("QUEUE_FILE", "queue.json");
