/* 
    telem-alerts filters through new datasets sent from the ground station
    to determine if any telemetry values fall outside the pre-defined telemetry
    limits (both lower and upper bounds). if so, an SMS will be sent to all 
    users subscribed to the system associated with the componentTelemetry. 
    additionally, each anomaly will be stored separately for easy future reference.
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

const dotenv = require('dotenv');
dotenv.config();
var db = require('../database');

// twilio SMS requirements
const accountSid = process.env.TWILIO_ACCOUNTSID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNum = process.env.TWILIO_NUM
const client = require('twilio')(accountSid, twilioAuthToken);


router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => { // POST /telem-alerts receives a fresh batch of data from the ground station to be processed

        // cycle through all new data checking for anomalies
        for (telem in req.body.reading) {

        }

        // if anomaly...
        // get users subscribed to component whose telemetry item has an anomaly

        // if anomaly, get phone number of all users subscribed to 
        var phoneNum;

        try {
            db.query('SELECT phoneNumber FROM users WHERE userID = ?', userID, function (error, results, fields) {
                if (error) throw error;
                phoneNum = results[0].phoneNumber;

                // then send SMS alert to all phoneNums
                client.messages.create({
                    body: 'This is a CubeSat Telemetry Alert!!!',
                    from: twilioPhoneNum,
                    to: phoneNum
                }).then(message => console.log(message.sid));

            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }

    })

    // GET /telem-alerts returns the components that the user is currently subscribed to
    .get(parseUrlencoded, parseJSON, (req, res) => {

    })

    // PUT /telem-alerts updates the components that the user is currently subscribed to
    .put(parseUrlencoded, parseJSON, (req, res) => {

    })

module.exports = router;