//===========================================
//               DEPENDENCIES
//===========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { PORT, DATABASE_URL } = process.env;
const Songs = require('./models/songs');
const Projects = require('./models/projects');
const projectsController = require('./controllers/projects');
const songsController = require('./controllers/songs');

// connect to mongodb

mongoose.connect(DATABASE_URL);

// mongoose listeners

mongoose.connection.on('connected', () => console.log('connected to mongodb'));
mongoose.connection.on('disconnected', () => console.log('disconnected from mongodb'));
mongoose.connection.on('error', () => console.log(`${error} mongodb`));


//===========================================
//               MIDDLEWARE
//===========================================
app.use(cors());
app.use(express.json());

//===========================================
//               ROUTES
//===========================================

app.use('/projects', projectsController);
app.use('/songs', songsController);

//-------------------------------------------
//index
// app.get('/', (req, res) => {
//     res.send('hey there!')
// });

//===========================================
//               LISTENERS
//===========================================

app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`)
});