const pcapParser = require('pcap-parser');
const fs = require('fs');

function parsePCAP(pcapData, IPs, URLs, hashedValues) {
    const results = [];
    curr = {};
    str = '';
    for (let char of pcapData) {
        if (char == '\n') {
            if (str == '-------------------') {
                console.log(curr);
                if (IPs.includes(curr.sourceIP) || IPs.includes(curr.destinationIP)) {
                    results.push(curr);
                }
                curr = {};
            }
            else {
                const breakStr = str.split(" ");
                // console.log(breakStr[1]);
                if (breakStr[0] == 'Timestamp:') curr.time = breakStr[1];
                else if (breakStr[0] == 'Source-IP:') curr.sourceIP = breakStr[1];
                else if (breakStr[0] == 'Destination-IP:') curr.destinationIP = breakStr[1];
            }
            str = '';
        }
        else {
            str += char;
        }
    }
    if (str == '-------------------') {
        console.log(curr);
        if (IPs.includes(curr.sourceIP) || IPs.includes(curr.destinationIP)) {
            results.push(curr);
        }
        curr = {};
    }
    return results;
}

module.exports = {
    parsePCAP,
};
