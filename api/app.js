const express = require('express');
const mongoose = require('mongoose');
const authcontroller = require('./controller/authcontroller');
const authJwt = require('./middlewares/authJwt');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/api-todos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('MongoDB connection error:', err));

app.use(rateLimiter);
app.use(authJwt);


module.exports = app;