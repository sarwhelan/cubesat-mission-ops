const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        console.log('POST TELECOMMAND');
        res.send('Success');
        // Log telecommands
        // Forward to the ether?
    });

module.exports = router;