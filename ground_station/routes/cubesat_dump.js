const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const http = require('http');
const logger = require('../logger');

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
    	console.log('rcvd post');
        var options = {
        	host: "127.0.0.1",
        	port: "3000",
        	path: "/gs-template",
        	method: "POST",
        	headers: {
        		"Content-Type": "application/json",
        		"Authorization": "Bearer token"
        	}
        };
        var fwdReq = http.request(options, function(fwdRes) {
        	console.log('entered cb')
        	var respStr = "";
        	fwdRes.on("data", function(data) {
        		respStr += data;
        	});
        	fwdRes.on("end", function() {
        		console.log(respStr);
        		res.send('Success');
        	});
        });
        fwdReq.write(JSON.stringify(req.body));
        fwdReq.end();
    });

module.exports = router;