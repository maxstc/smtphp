import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
let db = client.db("smtphp").collection("addresses");

import * as https from "https";
const options = {
    key: fs.readFileSync("../crypt/key.pem"),
    cert: fs.readFileSync("../crypt/cert.pem"),
}

let clientHtml = fs.readFileSync("../webclient/index.html");

let addresses = "";

function refreshAddresses() {
    addresses = JSON.stringify(db.find().toArray());
}

https.createServer(options, (req, res) => {
    if (req.url === "addresses") {
        res.writeHead(200);
        res.end(addresses);
    }
    else {
        res.writeHead(200);
        res.end(clientHtml);
    }
}).listen(443);

setInterval(() => {refreshAddresses();}, 10000);