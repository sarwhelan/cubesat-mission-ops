const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        console.log('POST DUMP');
        res.send('Success');
        // Save dump to external
        // Forward to application server
    });

module.exports = router;