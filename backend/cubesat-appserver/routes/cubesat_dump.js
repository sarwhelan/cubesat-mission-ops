const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {
            console.log(req.body);
            res.send('Success');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;
