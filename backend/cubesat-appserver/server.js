const express = require('express');
const app = express();

var telecommands = require('./routes/telecommands');
var template = require('./routes/template');
var db_template = require('./routes/db-template');

const port = 3000;

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use('/telecommands', telecommands);
app.use('/template', template);
app.use('/db-template', db_template);

app.listen(port, () => console.log(`App listening on port ${port}!`));