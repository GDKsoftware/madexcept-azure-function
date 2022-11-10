const winston = require('winston');

require('dotenv').config();

let logger;
if (process.env.LOKIHOST) {
    const LokiTransport = require('winston-loki');

    logger = winston.createLogger({
        transports: [
            new LokiTransport({
                batching: false,
                json: true,
                host: process.env.LOKIHOST,
                basicAuth: process.env.LOKIAUTH,
                onConnectionError: (err) => {
                    console.error(err);
                },
            })],
    });
} else {
    logger = winston.createLogger();
}

module.exports = {
    logger,
};
