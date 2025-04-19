/////MONGODB CONNECTION
import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
let db = client.db("smtphp").collection("addresses");

/////SMTP SERVER
import { SMTPServer } from "smtp-server";
let options = {
    name: "YouNaughtyNaughty",
    hideSize: true,
    hidePIPELINING: true,
    hide8BITMIME: true,
    hideSMTPUTF8: true,
    authOptional: true,
    onConnect: (session, callback) => {
        db.insertOne({
            address: session.remoteAddress,
            timestamp: Date.now(),
        });
        return callback();
    }
}
const server = new SMTPServer(options).listen(25);

/////WEB SERVER
//import * as https from "https";
import * as http from "http";
// const options = {
//     key: fs.readFileSync("../crypt/key.pem"),
//     cert: fs.readFileSync("../crypt/cert.pem"),
// }

import * as fs from "fs";
let clientHtml = fs.readFileSync("../webclient/index.html");

let addresses = "";

function refreshAddresses() {
    db.find().toArray().then((arr) => {
        addresses = JSON.stringify(arr);
    });
}

//https.createServer(options, (req, res) => {
http.createServer((req, res) => {
    if (req.url === "/addresses") {
        res.writeHead(200);
        res.end(addresses);
    }
    else {
        res.writeHead(200);
        res.end(clientHtml);
    }
}).listen(443);

refreshAddresses();
setInterval(() => {refreshAddresses();}, 10000);