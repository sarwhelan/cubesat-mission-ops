/*
    modify-telem-limit allows admin users the ability to modify telemetryRanges
    associated with a componentTelemetry, through the PUT route.
    this of course also entails displaying all of the current ranges per 
    system/component/componentTelemetry, as per the GET route.
*/

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');
const System = require('../classes/system-limits');
const Component = require('../classes/component');
const ComponentTelem = require('./component-telemetry');
var Promise = require("bluebird");

router.route('/')
    // PUT /telem-limits
    .put(parseUrlencoded, parseJSON, (req, res) => {

    })


    // GET /telem-limits returns all telemetry entries with their associated systems, components, and range values and units
    .get(parseUrlencoded, parseJSON, (req, res) => {

        try {

            db.query('SELECT sys.systemID, sys.systemName as `system name`, comp.componentID, comp.name as `component name`, ' + 
                'telem.upperBound as `upper bound`, telem.lowerBound as `lower bound`, types.name as `unit` FROM systems sys ' + 
                'INNER JOIN components comp ON sys.systemID = comp.systemID INNER JOIN componentTelemetry telem ON ' +
                'comp.componentID = telem.componentID INNER JOIN telemetryTypes types ON telem.telemetryTypeID = types.telemetryTypeID ' + 
                'ORDER BY sys.systemID, comp.componentID', 
                function (error, results) {

                if(error) throw error;
                res.json(results);

                })

        } catch (err) {
            console.log(err);
            res.send(err);
        }
    })

    
module.exports = router;
