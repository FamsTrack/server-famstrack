const express = require('express')
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const indexRouter = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(indexRouter);
app.use(errorHandler)

module.exports = app