const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("SELECT * FROM components;", function (error, results, fields) {
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
            var insertParams = [req.body.systemID, req.body.name];
            db.query('INSERT INTO components (systemID, name) VALUES (?, ?)', insertParams, (error, results, fields) => {
                if (error) throw error;
                console.log('Inserted component successfully');
                res.json(results);
            });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    });

module.exports = router;