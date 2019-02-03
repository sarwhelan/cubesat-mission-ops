const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const logger = require('../logger');
const fs = require('fs');

// Constant path for stored queue JSON object.
const queuePath = `${__dirname}/../queue/queue.json`;

router.route('/')
	// Rewrites the current queue in waiting with the received (updated) queue as a JSON object.
	.post(parseUrlencoded, parseJSON, (req, res) => {
		try 
		{
			// Write to local queue and parse back.
			fs.writeFileSync(queuePath, JSON.stringify(req.body));
			success = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
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
	    	success = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
	    	res.send(success);
	    	logger.info('GET /queue SUCCESS');
    	} catch (e) {
    		res.send(e.message)
    		logger.error('GET /queue ERROR: %s', e);
    	}
    });

module.exports = router;