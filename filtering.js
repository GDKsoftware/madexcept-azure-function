require('dotenv').config();

function getApiKeyForApplication(application) {
    if (!application) return false;

    const lwapp = application.toLowerCase();
    const filters = process.env.BUGSNAG_FILTERS.split(':');
    for (let f of filters) {
        const fup = f.toUpperCase();
        const retext = process.env[fup + '_RE'];
        const re = new RegExp(retext, "i");
        if (lwapp.match(re)) {
            return process.env[fup + '_API_KEY'];
        }
    }

    return false;
}

function isAllowed(application) {
    const apikey = getApiKeyForApplication(application);
    return !!apikey;
}

module.exports = {
    isAllowed,
    getApiKeyForApplication,
};
