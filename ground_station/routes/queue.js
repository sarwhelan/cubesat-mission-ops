// Node modules
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const fs = require('fs');
const path = require('path');

// Imports
const logger = require('../logger');
const constants = require('../constants');

router.route('/')
	// Rewrites the current queue in waiting with the received (updated) queue as a JSON object.
	.post(parseUrlencoded, parseJSON, (req, res) => {
		try 
		{
			// Write to local queue and parse back.
			fs.writeFileSync(constants.CURR_QUEUE_PATH, JSON.stringify(req.body));
			// Copy last saved queue for current date to external storage.
			/// TODO: Figure out how often we care about snapshotting the queue
			var date = new Date();
			var dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
			subDirPath = path.join(constants.QUEUE_BACKUP_DIR, dateString);
			if (!fs.existsSync(subDirPath)) {
				fs.mkdirSync(subDirPath);
			}
			destPath = path.join(subDirPath, path.basename(constants.CURR_QUEUE_PATH));
			fs.copyFile(constants.CURR_QUEUE_PATH, destPath, (err) => {
				if (err) throw err;
				logger.log('debug', `Queue copy from ${constants.CURR_QUEUE_PATH} to ${destPath} successful`);
			});
			// Parse back for verification
			success = JSON.parse(fs.readFileSync(constants.CURR_QUEUE_PATH, 'utf8'));
			res.send(success);
			logger.info('POST /queue SUCCESS');
		} catch (e) {
			res.send(e.message);
			logger.error('POST /queue ERROR: %s', e);
		}
	})
	// Returns current queue JSON object from current queue file.
    .get(parseUrlencoded, parseJSON, (req, res) => {
    	try 
    	{
	    	success = JSON.parse(fs.readFileSync(constants.CURR_QUEUE_PATH, 'utf8'));
	    	res.send(success);
	    	logger.info('GET /queue SUCCESS');
    	} catch (e) {
    		res.send(e.message)
    		logger.error('GET /queue ERROR: %s', e);
    	}
    });

module.exports = router;