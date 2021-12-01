#!/usr/bin/env ts-node

import {AnyError, Collection, Filter, MongoClient, MongoClientOptions, ObjectId} from "mongodb";
import {Flight, FlightProjection, FlightQuery} from "./models/flight";
require('dotenv').config();
const client = require('mongodb').MongoClient;

function getAll(col: Collection<Partial<Flight>>, query?: Partial<Flight> | Partial<FlightQuery>, projection?: FlightProjection) {
    return col.find(query as Filter<Partial<Flight>>, projection).toArray();
}

function getOne(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>, projection?: FlightProjection) {
    return col.findOne(query as Filter<Partial<Flight>>, projection);
}

function addMany(col: Collection<Partial<Flight>>, documents: Partial<Flight>[]) {
    return col.insertMany(documents as Pick<Partial<Flight>, "departure" | "arrival" | "eta" | "distance">[] & { _id?: ObjectId | undefined; });
}

function addOne(col: Collection<Partial<Flight>>, document: Partial<Flight>) {
    return col.insertOne(document as Pick<Partial<Flight>, "departure" | "arrival" | "eta" | "distance"> & { _id?: ObjectId | undefined; });
}

function deleteMany(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>) {
    return col.deleteMany(query as Filter<Partial<Flight>>);
}

function deleteOne(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>) {
    return col.findOneAndDelete(query as Filter<Partial<Flight>>);
}

function updateMany(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>, update: Partial<Flight> ) {
    return col.updateMany(query as Filter<Partial<Flight>>, {$set: update});
}

function updateOne(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>, update: Partial<Flight> ) {
    return col.findOneAndUpdate(query as Filter<Partial<Flight>>, {$set: update});
}

function removeField(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>, fieldName: string) {
    return col.updateOne(query as Filter<Partial<Flight>>, {$unset: {[fieldName]: ""}});
}

function addToField(col: Collection<Partial<Flight>>, query: Partial<Flight> | Partial<FlightQuery>, fieldName: string, data: Partial<Flight>) {
    return col.updateOne(query as Filter<Partial<Flight>>, {$push: {[fieldName]: data}});
}

function aggregate(col: Collection<Partial<Flight>>, from: string, localField: string, foreignField: string, as: string) {
    return col.aggregate([{$lookup: { from, localField, foreignField, as }}]).toArray();
}

async function playground(col: Collection<Partial<Flight>>) {
    const all = await getAll(col, {distance: 12000}, {projection: {departure: 1, arrival: 1, _id: 0}});
    const one = await getOne(col, {arrival: "CAD"}, {projection: {departure: 1, arrival: 1, _id: 0}});
    // const addManyRes = await addMany(col, [{arrival: "AAA", departure: 'BBB', distance: 0, eta: ""}]);
    // const addOneRes = await addOne(col, {arrival: "AAA", departure: 'BBB', distance: 0, eta: ""});
    // const deleteManyRes = await deleteMany(col, {arrival: "AAA"});
    // const deleteOneRes = await deleteOne(col, {arrival: "AAA"});
    // const updateManyRes = await updateMany(col, {arrival: "AAA"}, {departure: "CCC"});
    // const updateOneRes = await updateOne(col, {arrival: "AAA"}, {departure: "CCC"});
    // const removeFieldRes = await removeField(col, {arrival: "AAA"}, 'eta');
    // const addToFieldRes = await addToField(col, {distance: {$gt: 10000}}, 'someArrayField', {example: "XXX"});
    // const agg = await aggregate(col, 'control', '_id', 'flights', 'controlData');
}

(() => {client.connect(process.env.CONNECTION_STRING, {} as MongoClientOptions, async (err: AnyError, client: MongoClient | undefined) => {
    if (err) {
        return console.log(err);
    }
    const db = client?.db(process.env.DB_NAME);
    try {
        const col = await db?.collection(process.env.COLLECTION_NAME as string);
        await playground(col as Collection<Partial<Flight>>);
    } catch (err) {
        console.log('Couldn\'t connect to mongo server', err);
    }
    process.exit(1);
})})();