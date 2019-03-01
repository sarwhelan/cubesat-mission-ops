// application server outlining the routes utilized by the
// frontend web application as well as the ground station server

const express = require('express');
const app = express();

var telecommands = require('./routes/telecommands');
var template = require('./routes/template');
var db_template = require('./routes/db-template');
var cubesat_dump = require('./routes/cubesat_dump');
var modify_telem_limit  = require('./routes/modify-telem-limit');
var components = require('./routes/components');
var componentTelemetry = require('./routes/component-telemetry');
var telemetryData = require('./routes/telemetry-data');
const logger = require('./logger');

const port = 3000;

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(logger);

app.use('/telecommands', telecommands);
app.use('/template', template);
app.use('/db-template', db_template);
app.use('/cubesat_dump', cubesat_dump);
app.use('/modify-telem-limit', modify_telem_limit);
app.use('/components', components);
app.use('/component-telemetry', componentTelemetry);
app.use('/telemetry-data', telemetryData);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;