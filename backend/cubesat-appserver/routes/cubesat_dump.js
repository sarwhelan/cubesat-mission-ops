/**
 * Node modules required.
 */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

/**
 * Internal imports.
 */
const db = require('../database');
const anomalyDetector = require('../helpers/detect-anomalies');

/**
 * Root path requests.
 */
router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        // Detect anomalies in the data dump.
        anomalyDetector.dataDump(req.body);

        try {
            var now = new Date();
            
            // Set next pass in line as "occurred" and update the actual pass date time of the pass.
            db.query("SELECT estimatedPassDateTime FROM passes WHERE passHasOccurred = 0 ORDER BY estimatedPassDateTime ASC", function(error, results, fields) {
                let nextUnoccurredPass = results[0].estimatedPassDateTime;
                db.query("UPDATE passes SET passHasOccurred = ?, actualPassDateTime = ? WHERE estimatedPassDateTime = ?", [1, now, nextUnoccurredPass], function(error, results, fields) {
                    if (error) throw error;
                    console.log(results);
                })
            })

            // Insert all telemetry data contained in the body into the database.
            for (reading = 0; reading < req.body.length; reading++) {
                let insertParams = [req.body[reading].componentTelemetryID, req.body[reading].collectionDateTime, req.body[reading].telemetryValue];
                db.query("INSERT INTO telemetryData (componentTelemetryID, collectionDateTime, telemetryValue) VALUES (?, ?, ?)", insertParams, function(error, results, fields) {
                    if (error) throw error;
                    console.log(results);
                })
            }
            res.sendStatus(200);

        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;
