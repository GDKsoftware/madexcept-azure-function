const winston = require('winston');
const LokiTransport = require('winston-loki');

const logger = winston.createLogger({
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

module.exports = {
    logger,
};
