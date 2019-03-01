// modify-telem-limit allows for modification of the telemetry limits via the PUT route.
// this of course also entails displaying all of the current limits per 
// system and component, as per the GET route.

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {

    })

    .put(parseUrlencoded, parseJSON, (req, res) => {
        
    })