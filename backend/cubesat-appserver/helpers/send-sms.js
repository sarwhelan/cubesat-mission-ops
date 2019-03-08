const dotenv = require('dotenv');
dotenv.config();

function sendSMS(phoneNum, systemName, componentName, telemetryName, value, telemType, dateTime) {
    const accountSid = process.env.TWILIO_ACCOUNTSID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    client.messages
      .create({
         body: 'This is a CubeSat alert. System: %s, Component: %s, Telemetry: %s, Value: %s%s, Time: %s' (systemName, componentName, telemetryName, value, telemType, dateTime),
         from: process.env.TWILIO_NUM,
         to: phoneNum
       })
      .then(message => console.log(message.sid));
}

module.exports.sendSMS = sendSMS;