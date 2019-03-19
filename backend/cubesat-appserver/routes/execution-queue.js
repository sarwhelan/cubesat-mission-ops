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
router.route('/:executionPassID')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        // Returns all queued telecommands with the given execution pass ID.
        try {
            db.query("SELECT * FROM queuedTelecommands WHERE executionPassID = ?", req.params.executionPassID, function (error, results, fields) {
                if (error) throw error;
                res.send(results);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;