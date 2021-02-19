const express = require('express')
const cors = require('cors');
const indexRouter = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
app.use(indexRouter);
app.use(errorHandler)

module.exports = app