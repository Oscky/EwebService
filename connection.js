import { MongoClient } from "mongodb";
import 'dotenv/config'

const connectionString = process.env.MONGOURI;
const client = new MongoClient(connectionString);

export async function connect(database='eweb', collection='lesson') {
    try {
        const conn = await client.connect();
        const db = await conn.db(database);
        const coll = await db.collection(collection);
        return coll;

    } catch (err) { console.log(err) };
    return [];
}