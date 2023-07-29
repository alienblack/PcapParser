const express = require('express');
const multer = require('multer');
const PCAPParser = require('./pcapParser');
const JSONParser = require('./jsonParser');
const app = express();

app.set('view engine', 'ejs');

const empty = {};
app.get('/analyze', (req, res) => {
    res.render('home.ejs', { results: empty })
})

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/analysisDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('rishank is god');
})

const analysisSchema = new mongoose.Schema({
    ip: String,
    url: String,
    hashedValue: String
});

const Analysis = mongoose.model('Analysis', analysisSchema);

// Handle POST request for analysis
app.post('/analyze', upload.fields([{ name: 'json', maxCount: 1 }, { name: 'pcap', maxCount: 1 }]), (req, res) => {
    const jsonFile = req.files['json'][0];
    const pcapFile = req.files['pcap'][0];

    // Extract IP addresses, URLs, and hashed values from the JSON file
    const jsonData = JSON.parse(jsonFile.buffer.toString());
    const { IPs, URLs, hashedValues } = JSONParser.parse(jsonData);
    for (i in IPs) {
        curr = {}
        curr.ip = IPs[i];
        curr.url = URLs[i];
        curr.hashedValue = hashedValues[i];
        const store = new Analysis(curr);
        store.save();
    }

    // Parse the PCAP file and find occurrences of IP addresses, URLs, and hashed values
    const pcapData = pcapFile.buffer.toString(); // Assuming pcapParser is implemented separately
    const occurrences = PCAPParser.parsePCAP(pcapData, IPs, URLs, hashedValues)

    // Return results to the frontend
    console.log(occurrences);
    res.render('home.ejs', { results: occurrences });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
