//===========================================
//               DEPENDENCIES
//===========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { PORT, DATABASE_URL } = process.env;

// connect to mongodb

mongoose.connect(DATABASE_URL);

// mongoose listeners

mongoose.connection.on('connected', () => console.log('connected to mongodb'));
mongoose.connection.on('disconnected', () => console.log('disconnected from mongodb'));
mongoose.connection.on('error', () => console.log(`${error} mongodb`));


//===========================================
//               LISTENERS
//===========================================

app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`)
});