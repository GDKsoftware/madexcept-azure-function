require('dotenv').config();

function isAllowed(application) {
    const filters = process.env.FILTER.split(':');
    for (let f of filters) {
        const re = new RegExp(f);
        if (application.match(re)) {
            return true;
        }
    }

    return false;
}

module.exports = {
    isAllowed,
};
