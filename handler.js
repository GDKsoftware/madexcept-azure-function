const multipart = require('parse-multipart-data');
const uuid = require('uuid');

class MadexceptRequestHandler {
    constructor(storageFunc) {
        this.storageFunc = storageFunc;
    }

    async processFiles(parts, logFunc) {
        const shared_uuid = uuid.v1();

        for (let idxPart = 0; idxPart < parts.length; idxPart++) {
            if (parts[idxPart].filename) {
                if (parts[idxPart].data) {
                    this.storageFunc(parts[idxPart].filename, parts[idxPart].data, shared_uuid, logFunc);
                }
            }
        }
    }

    async processRequestBody(req, logFunc) {
        const bodyBuffer = Buffer.from(req.body);
        const contentType = req.headers['content-type'];
        const boundary = multipart.getBoundary(contentType);
        const parts = multipart.parse(bodyBuffer, boundary);

        if (!parts.length) {
            throw new Error('File buffer is incorrect');
        }

        await this.processFiles(parts, logFunc);
    }

    async handle(req, res, logFunc) {
        await this.processRequestBody(req, logFunc);
    }
}

module.exports = {
    MadexceptRequestHandler: MadexceptRequestHandler,
};
