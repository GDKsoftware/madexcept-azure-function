const https = require('https');
require('dotenv').config();

class BugSnagSender {
    send(data, apikey) {
        const strdata = JSON.stringify(data);
        const reqdata = {
            hostname: 'notify.bugsnag.com',
            method: 'POST',
            path: '/',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': strdata.length,
                'Bugsnag-Api-Key': apikey,
                'Bugsnag-Payload-Version': '5',
                'Bugsnag-Sent-At': data.events[0].device.time,
            },
        };
        const req = https.request(reqdata, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
              console.log('No more data in response.');
            });
        });
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        req.write(strdata);
        req.end();
    }
}

module.exports = {
    BugSnagSender,
};
