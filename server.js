//===========================================
//               DEPENDENCIES
//===========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { PORT, DATABASE_URL } = process.env;
const projectsController = require('./controllers/projects');
const songsController = require('./controllers/songs');
const admin = require("firebase-admin");
const serviceAccount = require("./apw-auth-firebase-adminsdk-hjk2m-d9b696e8e2.json");

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

app.use('/api/songs', songsController);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(async function(req, res, next) {
    try {
        const token = req.get('Authorization');
        const authUser = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
        req.user = authUser;
        next();
    } catch (error) {
        console.log(error)
    }
});

// router auth middleware
function isAuthenticated(req, res, next) {
    if(req.user) return next();
    else res.status(401).json({message: 'unauthorized'});
};

//===========================================
//               ROUTES
//===========================================

app.use('/api/projects', isAuthenticated, projectsController);
// app.use('/api/songs', songsController);

app.get('/api/*', (req, res) => res.status(404).json({message: 'That route was not found'}));
app.get('/api/*', (req, res) => res.status(404).json({message: 'That route was not found'}));


//===========================================
//               LISTENERS
//===========================================

app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`)
});