// JSONParser module for extracting IP addresses, URLs, and hashed values from JSON

function parse(jsonData) {
    const IPs = [];
    const URLs = [];
    const hashedValues = [];

    // Extract IP addresses
    if (jsonData.hasOwnProperty('IPs')) {
        IPs.push(...jsonData.IPs);
    }

    // Extract URLs
    if (jsonData.hasOwnProperty('URLs')) {
        URLs.push(...jsonData.URLs);
    }

    // Extract hashed values
    if (jsonData.hasOwnProperty('hashedValues')) {
        hashedValues.push(...jsonData.hashedValues);
    }

    return { IPs, URLs, hashedValues };
}

module.exports = {
    parse
};
