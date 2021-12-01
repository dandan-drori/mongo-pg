#!/usr/bin/env ts-node

// todo aggregation

import {AnyError, MongoClient, MongoClientOptions} from "mongodb";
require('dotenv').config();
const client = require('mongodb').MongoClient;

function getAll(col: any, query?: any, projection?: any) {
    return col.find(query, projection).toArray();
}

function getOne(col: any, query: any, projection?: any) {
    return col.findOne(query, projection);
}

function addMany(col: any, documents: any) {
    return col.insertMany(documents);
}

function addOne(col: any, document: any) {
    return col.insertOne(document);
}

function deleteMany(col: any, query: any) {
    return col.deleteMany(query);
}

function deleteOne(col: any, query: any) {
    return col.findOneAndDelete(query);
}

function updateMany(col: any, query: any, update: any ) {
    return col.updateMany(query, {$set: update});
}

function updateOne(col: any, query: any, update: any ) {
    return col.findOneAndUpdate(query, {$set: update});
}

function removeField(col: any, query: any, fieldName: any) {
    return col.updateOne(query, {$unset: {[fieldName]: ""}});
}

function addToField(col: any, query: any, fieldName: any, data: any) {
    return col.updateOne(query, {$push: {[fieldName]: data}});
}

function aggregate(col: any, from: string, localField: string, foreignField: string, as: string) {
    return col.aggregate([{$lookup: { from, localField, foreignField, as }}]).toArray();
}

async function playground(col: any) {
    // const all = await getAll(col, {distance: 12000}, {projection: {departure: 1, arrival: 1, _id: 0}});
    // const one = await getOne(col, {arrival: "CAD"}, {projection: {departure: 1, arrival: 1, _id: 0}});
    // const addManyRes = await addMany(col, [{arrival: "AAA", departure: 'BBB', distance: 0, eta: ""}]);
    // const addOneRes = await addOne(col, {arrival: "AAA", departure: 'BBB', distance: 0, eta: ""});
    // const deleteManyRes = await deleteMany(col, {arrival: "AAA"});
    // const deleteOneRes = await deleteOne(col, {arrival: "AAA"});
    // const updateManyRes = await updateMany(col, {arrival: "AAA"}, {departure: "CCC"});
    // const updateOneRes = await updateOne(col, {arrival: "AAA"}, {departure: "CCC"});
    // const agg = await aggregate(col, 'control', '_id', 'flights', 'controlData');
}

(() => {client.connect(process.env.CONNECTION_STRING, {} as MongoClientOptions, async (err: AnyError, client: MongoClient | undefined) => {
    if (err) {
        return console.log(err);
    }
    const db = client?.db(process.env.DB_NAME);
    try {
        const col = await db?.collection(process.env.COLLECTION_NAME as string);
        await playground(col);
    } catch (err) {
        console.log('Couldn\'t connect to mongo server', err);
    }
    process.exit(1);
})})();