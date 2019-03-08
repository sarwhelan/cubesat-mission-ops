const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const db = require('../database');

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {

            for (reading = 0; reading < req.body.length; reading++) {
                let insertParams = [req.body[reading].componentTelemetryID, req.body[reading].collectionDateTime, req.body[reading].telemetryValue];
                db.query("INSERT INTO telemetryData (componentTelemetryID, collectionDateTime, telemetryValue) VALUES (?, ?, ?)", insertParams, function(error, response, fields) {
                    if (error) throw error;
                })
            }
            res.sendStatus(200);

        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;
