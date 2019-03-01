const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM componentTelemetry", function (error, results, fields) {
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
            var insertParams = [req.body.telemetryTypeID, req.body.componentID];
            db.query('INSERT INTO componentTelemetry (telemetryTypeID, componentID) VALUES (?, ?)', insertParams, (error, results, fields) => {
                if (error) throw error;
                console.log('Inserted component telemetry successfully');
                res.json(results);
            });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    });

router.route('/:componentID')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM componentTelemetry WHERE componentID = ?;", req.params.componentID, function (error, results, fields) {
                if (error) throw error;
                res.send(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;