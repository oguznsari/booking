const express = require("express");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const app = express();
const mainRouter = require('./routes/main')

// connectDB
const connectDB = require('./db/connect');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());                                        // json parser
app.use(cookieParser());                                        // cookie parser

app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/', mainRouter);

const port = process.env.PORT || 4000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
