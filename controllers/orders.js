import { connect } from '../connection.js';
import { ObjectId } from "bson"

let orders = [];
let db = null;

export const getOrders = async (req, res) => {
    db = await connect('eweb', 'orders');
    orders = await db.find().toArray();
    res.send(orders);
    console.log(orders);
}

export const createOrder = async (req, res) => {


    const orders = req.body;

    let { studentName, spaces, lessons = [], phoneNumber } = req.body;
    if (req.body.studentName != null) { orders.studentName = studentName; }
    else { res.send(`Student Name is required for placing order !`); return; }

    if (req.body.spaces != null) { orders.spaces = spaces; }
    else { res.send(`Please define number of spaces for the order !`); return; }

    if (req.body.lessons != null) { orders.lessons = lessons; }
    else { res.send(`Please specify lessons for the order`); return; }

    db = await connect('eweb', 'lesson');

    const lessonIds = [];
    lessons.forEach(lesson => {
        lessonIds.push(lesson.lessonId);
    });


    let availabilityFlags = [];

    await Promise.all(lessonIds.map(async lesson => {
        let availableLessons = null;
        let query = { _id: new ObjectId(lesson) };
        availableLessons = await db.find(query).toArray();
        availabilityFlags.push(availableLessons.length > 0 ? 1 : 0);
    }));

    console.log(availabilityFlags);

    if (availabilityFlags.includes(0)) {
        console.log('Not all selected lessons are valid within the order!');
        res.send(`Not all selected lessons are valid within the order!`);
        return;
    };

    if (req.body.phoneNumber != null) { orders.phoneNumber = phoneNumber; }
    else { res.send(`Phone number is required for placing order !`); return; }

    db = await connect('eweb', 'orders');
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

export const getOrder = async (req, res) => {
    const { _id } = req.params;
    db = await connect('eweb', 'orders');
    let query = { _id: new ObjectId(_id) };
    orders = await db.findOne(query);
    if (!orders) res.send("Not found").status(404);
    else res.send(orders).status(200);
}
