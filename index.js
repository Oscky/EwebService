import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'


import lessonRoutes from './routes/lessons.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = 4000;


app.use(bodyParser.json());

app.use('/lessons', lessonRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Hi there :) Nothing much to experience here, this is reserved for backoffice services !');
    
});

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));


