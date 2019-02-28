const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM telecommands;", function (error, results, fields) {
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
            var insertParameters = [req.body.componentID, req.body.command, req.body.name, req.body.defaultPriorityLevel, req.body.bandwidthUsage, req.body.powerConsumption];

            // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
            db.query('INSERT INTO telecommands (componentID, command, name, defaultPriorityLevel, bandwidthUsage, powerConsumption) VALUES (?, ?, ?, ?, ?, ?)', insertParameters, function (error, results, fields) {
                if (error) throw error;

                console.log("insert successful!!");
                res.sendStatus(200);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .put(parseUrlencoded, parseJSON, (req, res) => {
        try {

            var updateParameters = [req.body.componentID, req.body.command, req.body.name, req.body.defaultPriorityLevel, req.body.bandwidthUsage, req.body.powerConsumption, req.body.telecommandID];

            db.query('UPDATE telecommands SET componentID = ?, command = ?, name = ?, defaultPriorityLevel = ?, bandwidthUsage = ?, powerConsumption = ? WHERE telecommandID = ?', updateParameters, function (error, results, fields) {
                if (error) throw error;

                console.log("update successful!!");
                res.sendStatus(200);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;