import { MongoClient } from "mongodb";
import * as fs from "fs";
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
let db = client.db("smtphp").collection("addresses");

import * as http from "http";
// const options = {
//     key: fs.readFileSync("../crypt/key.pem"),
//     cert: fs.readFileSync("../crypt/cert.pem"),
// }

let clientHtml = fs.readFileSync("../webclient/index.html");

let addresses = "";

function refreshAddresses() {
    db.find().toArray().then((arr) => {
        addresses = JSON.stringify(arr);
    });
}

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