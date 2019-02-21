const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
const http = require('http');
const logger = require('../logger');

router.route('/')
    // Forward CubeSat dump in another POST to our application server.
    .post(parseUrlencoded, parseJSON, (req, res) => {
        var options = {
        	host: "httpbin.org",
        	//port: "3000",
        	path: "/anything",
        	method: "POST",
        	headers: {
        		"Content-Type": "application/json",
        		"Authorization": "Bearer token",
        		"Access-Control-Allow-Origin": "*"
        	}
        };
        var fwdReq = http.request(options, function(fwdRes) {
        	var respStr = "";
        	fwdRes.on("data", function(data) {
        		respStr += data;
        	});
        	fwdRes.on("end", function() {
        		console.log(respStr);
        		res.send('Success');
        	});
        });
        fwdReq.write(req.body);
        fwdReq.end();
    });

module.exports = router;
