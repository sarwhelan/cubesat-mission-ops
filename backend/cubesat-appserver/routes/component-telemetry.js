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
var db = require('../database');

/**
 * Root path requests.
 */
router.route('/')
    // Returns all component telemetry entries.
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // If the GET includes a telemetry type ID query parameter, select all with that ID.
            if (req.query.telemetryTypeID) {
                db.query("SELECT * FROM componentTelemetry WHERE telemetryTypeID = ?", req.query.telemetryTypeID, function (error, results, fields) {
                    if (error) throw error;
                    res.send(results);
                });
            } else {
                db.query("SELECT * FROM componentTelemetry", function (error, results, fields) {
                    if (error) throw error;
                    res.send(results);
                });
            }
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Creates a new component telemetry object.
            // NOTE: upperBound and lowerBound can be null.
            hasBounds = req.body.hasBounds ? 1 : 0;
            var insertParams = [req.body.telemetryTypeID, req.body.componentID, req.body.name, hasBounds, req.body.upperBound, req.body.lowerBound];
            db.query('INSERT INTO componentTelemetry (telemetryTypeID, componentID, name, hasBounds, upperBound, lowerBound) VALUES (?, ?, ?, ?, ?, ?)', insertParams, (error, results, fields) => {
                if (error) throw error;
                res.json({newCompTelem: results.insertId});
            });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    })

/**
 * Path requests with a given ID.
 * POST: Handles with a Component ID.
 * PUT: Handles with a Component Telemetry ID.
 * DELETE: Handles with a Component Telemetry ID.
 */
router.route('/:ID')
    // Returns all component telemetry associated with the component ID parameter specified.
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM componentTelemetry WHERE componentID = ?;", req.params.ID, function (error, results, fields) {
                if (error) throw error;
                res.send(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })

    // Updates the fields of the component telemetry specified, by ID.
    .put(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var updateParams = [req.body.telemetryTypeID, req.body.componentID, req.body.name, req.body.hasBounds, req.body.upperBound, req.body.lowerBound, req.params.ID];

            db.query("UPDATE componentTelemetry SET telemetryTypeID = ?, componentID = ?, name = ?, hasBounds = ?, upperBound = ?, lowerBound = ? " +
                "WHERE componentTelemetryID = ?", updateParams, function (error, results, fields) {
                if (error) throw error;
                res.json({updateCompTelem:results.insertId});
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })

    // Deletes the component telemetry entry, specified by ID.
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("DELETE FROM componentTelemetry WHERE componentTelemetryID = ?", req.params.ID, function(error, results, fields) {
                if (error) throw error;
                res.json({byeCompTelem:results.insertId});
            })
        } catch(err) {
            console.log(err);
            res.send(err);
        }
    })

module.exports = router;