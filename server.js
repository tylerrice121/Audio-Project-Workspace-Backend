//===========================================
//               DEPENDENCIES
//===========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { PORT, DATABASE_URL, PRIVATE_KEY_ID, PRIVATE_KEY, CLIENT_ID } = process.env;
const projectsController = require('./controllers/projects');
// const songsController = require('./controllers/songs');
const admin = require("firebase-admin");

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

// app.use('/api/songs', songsController);

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "apw-auth",
    "private_key_id": PRIVATE_KEY_ID,
    "private_key": PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-hjk2m@apw-auth.iam.gserviceaccount.com",
    "client_id": CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hjk2m%40apw-auth.iam.gserviceaccount.com"
  })
});

app.use(async function(req, res, next) {
    try {
        const token = req.get('Authorization');
        if(token) {
            const authUser = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
            req.user = authUser;
        }

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