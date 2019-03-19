/**
 * Node modules required.
 */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

/**
 * Root path requests.
 */
router.route('/')
    // Returns all components.
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM components", function (error, results, fields) {
                if (error) throw error;
                res.send(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Creates a new component, with the system ID specified in the body.
            var insertParams = [req.body.systemID, req.body.name];
            db.query('INSERT INTO components (systemID, name) VALUES (?, ?)', insertParams, (error, results, fields) => {
                if (error) throw error;
                res.json({newComp:results.insertId});
            });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    });

/**
 * Path requests with a given ID.
 * PUT: Handles with a Component ID.
 * DELETE: Handles with a Component ID.
 * GET: Handles with a System ID.
 */
router.route('/:ID')
    // Updates an existing component.
    .put(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var updateParams = [req.body.systemID, req.body.name, req.params.ID];
            db.query('UPDATE components SET systemID = ?, name = ? WHERE componentID = ?', updateParams, (error, results, fields) => {
                if (error) throw error;
                res.json({updateComp: results.insertId});
            })
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    })
    .delete(parseUrlencoded, parseJSON, (req, res) => {

        try {
            // Removes an existing component and all of its associated component telemetry.
            // Delete all component telemetry with this component ID.
            db.query("DELETE FROM componentTelemetry WHERE componentID = ?", req.params.ID, function(error, results, fields) {
                
                // Then delete the component itself from the component table.
                try {
                    db.query("DELETE FROM components WHERE componentID = ?", req.params.ID, function(error, results, fields) {
                        if (error) throw error;
                        res.json({byeComp: results.insertId});
                    })
                } catch(err) {
                    console.log(err);
                    res.send(err);
                }
            
            })
        } catch(err) {
            console.log(err);
            res.send(err);
        }
    })
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Returns all components associated with the system ID specified as a parameter.
            db.query("SELECT * FROM components WHERE systemID = ?", req.params.ID, function(error, results, fields) {
                if (error) throw error;
                res.send(results);
            })
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })

module.exports = router;