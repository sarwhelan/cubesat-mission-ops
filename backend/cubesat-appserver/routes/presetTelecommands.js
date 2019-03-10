const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // var insertParameters = [req.body.componentID, req.body.command, req.body.name, req.body.defaultPriorityLevel, req.body.bandwidthUsage, req.body.powerConsumption, req.body.archived];

            // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
/*             db.query('INSERT INTO telecommands (componentID, command, name, defaultPriorityLevel, bandwidthUsage, powerConsumption, archived) VALUES (?, ?, ?, ?, ?, ?, ?)', insertParameters, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
              }); */
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

router.route('/:id')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var batchID = req.params.id;
            
            db.query('SELECT presetTelecommands.*, telecommands.name from presetTelecommands JOIN telecommands on presetTelecommands.telecommandID = telecommands.telecommandID WHERE batchID = ? ORDER BY relativeExecutionTime', batchID, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .put(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var presetTelecommandID = req.params.id;
            var updateParams = [req.body.relativeExecutionTime, req.body.priorityLevel, req.body.commandParameters, presetTelecommandID];
            
            db.query('UPDATE presetTelecommands SET relativeExecutionTime = ?, priorityLevel = ?, commandParameters = ? WHERE presetTelecommandID = ?;', updateParams, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var presetTelecommandID = req.params.id;
            
            db.query('DELETE FROM presetTelecommands WHERE presetTelecommandID = ?', presetTelecommandID, function (error, results, fields) {
                if (error) throw error;

                res.json(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;