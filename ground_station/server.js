/*************
 * Ground station server, to run on Raspberry Pi.
 * Relaying relevant information between CubeSat and mission control application server.
 *************/

// Node modules
const express = require('express');
const logger = require('./logger');

// Imports
var poll_cubesat_dump = require('./data_dump/poll_cubesat_dump');
var queue = require('./routes/queue');

// Set up serve
const app = express();

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use('/queue', queue);

logger.log('info', 'App served.');
app.listen(3700, () => console.log('App listening on 3700'));

module.exports = app;