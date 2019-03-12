const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendSMS(phoneNum, systemName, componentName, telemetryName, value, telemType) {
    let bod = 'This is a CubeSat alert. System: ' + systemName + ', Component: ' + componentName + ', Telemetry Name: ' + telemetryName + ', Value: ' + value + telemType;
    client.messages
      .create({
         body: bod,
         from: process.env.TWILIO_NUM,
         to: phoneNum
       })
      .then(message => console.log(message.sid));
}

module.exports.sendSMS = sendSMS;