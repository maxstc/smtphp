import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const db = client.db("smtphp").collection("addresses");

import { SMTPServer } from "smtp-server";
let options = {
    name: "YouNaughtyNaughty",
    hideSize: true,
    hidePIPELINING: true,
    hide8BITMIME: true,
    hideSMTPUTF8: true,
    onConnect: (session, callback) => {
        db.insertOne({
            address: session.remoteAddress,
            timestamp: Date.now(),
        });
        return callback();
    }
}
const server = new SMTPServer(options);