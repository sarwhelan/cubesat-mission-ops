const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM queuedTelecommands;", function (error, results, fields) {
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
            var insertParameters = [req.body.executionPassID, req.body.transmissionPassID, req.body.userID, req.body.telecommandID, req.body.priorityLevel, req.body.executionTime];

            // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
            db.query('INSERT INTO queuedTelecommands (executionPassID, transmissionPassID, userID, telecommandID, priority, executionTimeUTC) VALUES (?, ?, ?, ?, ?, ?)', insertParameters, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

router.route('/:id')
    .put(parseUrlencoded, parseJSON, (req, res) => {
        try {

            var queuedTelecommandToUpdate = req.params.id;
            var updateParameters = [];

            db.query('UPDATE passes SET estimatedPassDateTime = ?, WHERE queuedTelecommandID = ?', updateParameters, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;