const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM telemetryTypes", function (error, results, fields) {
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
            var insertParams = [req.body.telemetryUnit, req.body.name];
            db.query('INSERT INTO telemetryTypes (telemetryUnit, name) VALUES (?, ?)', insertParams, (error, results, fields) => {
                if (error) throw error;
                res.json({newTelemType:results.insertId});
                //res.json(200);
            });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    });

module.exports = router;