import { connect } from '../connection.js';
import { ObjectId } from "bson"

let lessons = [];
let db = null;

export const getLessons = async (req, res) => {
    db = await connect();
    lessons = await db.find().toArray();
    res.send(lessons);
    console.log(lessons);
}

export const createLesson = async (req, res) => {
    const lesson = req.body;
    const { topic, description, location, price, discountPercentage, rating, space, category, image } = req.body;
    if (req.body.topic != null) { lesson.topic = topic; }
    else { res.send(`Lesson's topic is required !`) };

    if (req.body.description != null) { lesson.description = description; }
    else { res.send(`Lesson's description is required !`) };

    if (req.body.location != null) { lesson.location = location; }
    else { res.send(`Lesson's location is required !`) };

    if (req.body.price != null) { lesson.price = price; }
    else { res.send(`Lesson's price is required or put 0 if it is free !`) };

    if (req.body.discountPercentage != null) { lesson.discountPercentage = discountPercentage; }
    else { res.send(`Lesson's discountPercentage is required or put 0 for no discount !`) };

    if (req.body.space != null) { lesson.space = space; }
    else { res.send(`Lesson's space is required or put 0 if not available !`) };

    if (req.body.category != null) { lesson.category = category; }
    else { res.send(`Lesson's category is required for students to understand !`) };

    db = await connect();
    db.insertOne(req.body)
        .then((result) => {
            res.status(200).json({
                success: true,
                data: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        });
}

export const getLesson = async (req, res) => {
    const { _id } = req.params;
    db = await connect();
    let query = { _id: new ObjectId(_id) };
    lessons = await db.findOne(query);
    if (!lessons) res.send("Not found").status(404);
    else res.send(lessons).status(200);
}

export const filterLesson = async (req, res) => {

    db = await connect();
    const { key } = req.params;

    const agg = [
        { $search: { index: "default", autocomplete: { query: key, path: "topic" } } }
    ];
    lessons = await db.aggregate(agg).toArray();

    if (!lessons) res.send("Not found").status(404);
    else {
        res.send(lessons).status(200)
        console.log(lessons);
    };
}

export const deleteLesson = async (req, res) => {

    db = await connect();
    const { _id } = req.params;

    let query = { _id: new ObjectId(_id) };
    lessons = await db.findOne(query);

    if (!lessons) res.send("Not found").status(404);
    else {
        db.deleteOne(query);
        console.log(db.deleteOne(query));
        res.send(`Lesson with Id : ${_id} deleted successfully ! :) `);
        console.log(`Lesson with Id :  ${_id} deleted successfully ! :) `);
    };
}

export const updateLesson = async (req, res) => {
    const { _id } = req.params;
    let query = { _id: new ObjectId(_id) };

    const lesson = req.body;
    const { topic, description, location, price, discountPercentage, rating, space, category, image } = req.body;
    if (req.body.topic != null) { lesson.topic = topic; }
    else { res.send(`Lesson's topic is required !`) };

    if (req.body.description != null) { lesson.description = description; }
    else { res.send(`Lesson's description is required !`) };

    if (req.body.location != null) { lesson.location = location; }
    else { res.send(`Lesson's location is required !`) };

    if (req.body.price != null) { lesson.price = price; }
    else { res.send(`Lesson's price is required or put 0 if it is free !`) };

    if (req.body.discountPercentage != null) { lesson.discountPercentage = discountPercentage; }
    else { res.send(`Lesson's discountPercentage is required or put 0 for no discount !`) };

    if (req.body.space != null) { lesson.space = space; }
    else { res.send(`Lesson's space is required or put 0 if not available !`) };

    if (req.body.category != null) { lesson.category = category; }
    else { res.send(`Lesson's category is required for students to understand !`) };

    const updateQuery = { $set: req.body };
    console.log(updateQuery);

    db = await connect();
    lessons = await db.findOne(query);

    if (!lessons) res.send("Not found").status(404);
    else {
        db.updateOne(query, updateQuery);
        console.log(db.updateOne(query, updateQuery));
        res.send(`Lesson with Id : ${_id} updated successfully ! :) `);
        console.log(`Lesson with Id :  ${_id} updated successfully ! :) `);
    };

}