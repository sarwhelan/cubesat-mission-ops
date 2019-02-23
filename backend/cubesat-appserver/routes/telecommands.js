const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            var response;
            db.query("SELECT * FROM systems;", function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                res.send("The result is " + results[0].systemName);
              });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })
    .post(parseUrlencoded, parseJSON, (req, res) => {
        try {
            response = {
                'statusCode': 200,
                'body': JSON.stringify({
                    message: 'This is the post route'
                })
            };
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    
        res.send(response);
    });

module.exports = router;