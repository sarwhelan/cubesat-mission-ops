const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const logger = require('../logger');
const fs = require('fs');
const path = require('path');

// Constant path for stored queue JSON object.
const CURR_QUEUE_PATH = `${__dirname}/../queue/queue.json`;
// Constant path for external backup of queue.
const EXT_BACKUP_PATH = "/home/dzagar/Desktop/queuedumptest";

router.route('/')
	// Rewrites the current queue in waiting with the received (updated) queue as a JSON object.
	.post(parseUrlencoded, parseJSON, (req, res) => {
		try 
		{
			// Write to local queue and parse back.
			fs.writeFileSync(CURR_QUEUE_PATH, JSON.stringify(req.body));
			// Copy last saved queue for current date to external storage
			/// TODO: Figure out how often we care about snapshotting the queue
			var date = new Date();
			var dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
			subDirPath = path.join(EXT_BACKUP_PATH, dateString);
			if (!fs.existsSync(subDirPath)) {
				fs.mkdirSync(subDirPath);
			}
			destPath = path.join(subDirPath, path.basename(type));
			fs.copyFile(srcFilePath, destPath, (err) => {
				if (err) throw err;
				logger.log('debug', `Queue copy from ${srcFilePath} to ${destPath} successful`);
			});
			// Parse back for verification
			success = JSON.parse(fs.readFileSync(CURR_QUEUE_PATH, 'utf8'));
			res.send(success);
			logger.info('POST /queue SUCCESS');
		} catch (e) {
			res.send(e.message);
			logger.error('POST /queue ERROR: %s', e);
		}
	})
	// Returns current queue JSON object from file.
    .get(parseUrlencoded, parseJSON, (req, res) => {
    	try 
    	{
	    	success = JSON.parse(fs.readFileSync(CURR_QUEUE_PATH, 'utf8'));
	    	res.send(success);
	    	logger.info('GET /queue SUCCESS');
    	} catch (e) {
    		res.send(e.message)
    		logger.error('GET /queue ERROR: %s', e);
    	}
    });

module.exports = router;