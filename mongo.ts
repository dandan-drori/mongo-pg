#!/usr/bin/env ts-node

import {AnyError, MongoClient} from "mongodb";
const client = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

function getAll(col: any, query?: any, projection?: any) {
    return col.find(query).project(projection).toArray();
}

async function playground(col: any) {
    const res = await getAll(col, {distance: 12000}, {departure: 1, arrival: 1, _id: 0});
    console.log(res);

}

(() => {client.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, async (err: AnyError, client: MongoClient | undefined) => {
    if (err) {
        return console.log(err);
    }
    const db = client?.db('flights');
    try {
        const col = await db?.collection('flight');
        await playground(col);
        process.exit(1);
    } catch (err) {
        console.log('Couldn\'t connect to mongo server',err)
    }
})})();