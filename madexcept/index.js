const { BlobServiceClient, BlockBlobTier } = require('@azure/storage-blob');
const HTTP_CODES = require('http-status-enum');

const { BugreportParser } = require('../bugreport-parser');
const { BugSnagConverter } = require('../bugsnag-converter');
const { BugSnagSender } = require('../bugsnag-sender');
const { getApiKeyForApplication } = require('../filtering');
const { MadexceptRequestHandler } = require('../handler');
const { logger } = require('../logger');

require('dotenv').config();

let handler;
let containerClient;

if (process.env.USE_BUGSNAG) {
    handler = new MadexceptRequestHandler(bugsnagSend);
} else if (process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING) {
    handler = new MadexceptRequestHandler(storeFile);
} else {
    console.error('No azure or bugsnag configuration set');
    process.exit(1);
}

async function init() {
    if (!process.env.USE_BUGSNAG && !containerClient) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING);
        containerClient = blobServiceClient.getContainerClient('madexcept');
    }
}

async function storeFile(filename, data, uuid, logFunc) {
    if (isMadexceptLog(filename)) {
        const parser = new BugreportParser();
        parser.parsefromString(data.toString('utf-8'));
        const info = parser.getLokiInfo();

        if (info.message) {
            info.labels.storageuuid = uuid;
            logger.error(info);
        } else {
            throw new Error('unexpected error - ' + JSON.stringify(parser.details));
        }
    }

    const blobName = `${uuid}_${filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(data, data.length);
    try {
        await blockBlobClient.setAccessTier(BlockBlobTier.Cool);
    } catch {
        // ignore exception, this is not always available
    }
}

async function bugsnagSend(filename, data, uuid, logFunc) {
    if (isMadexceptLog(filename)) {
        const parser = new BugreportParser();
        parser.parsefromString(data.toString('utf-8'));

        const apikey = getApiKeyForApplication(parser.details.executable);
        if (apikey) {
            logFunc('Sending Madexcept report from ' + parser.details.executable + ' to bugsnag');

            const converter = new BugSnagConverter();
            const log = converter.convert(parser);

            const sender = new BugSnagSender();
            await sender.send(log, apikey);
        } else {
            logFunc('Madexcept report from ' + parser.details.executable + ' is filtered out');
        }
    }
}

function isMadexceptLog(filename) {
    return filename.endsWith('.txt');
}

async function madexcept(context, req) {
    if (!req.body || !req.body.length){
        context.res.body = `Request body is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        return;
    }

    await init();

    try {
        await handler.handle(req, context.res, context.log);

        context.res.status = HTTP_CODES.OK;
        context.res.body = 'Ok';
    } catch (err) {
        context.log(err);

        context.res.status = HTTP_CODES.BAD_REQUEST;
        context.res.body = 'Error';
    }
}

module.exports = madexcept;
