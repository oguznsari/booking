const express = require("express");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const app = express();
const mainRouter = require('./routes/main')

// connectDB
const connectDB = require('./db/connect');

// swagger ui
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load('./swagger.yaml');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());                                        // json parser
app.use(cookieParser());                                        // cookie parser

app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/', mainRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

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
