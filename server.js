//===========================================
//               DEPENDENCIES
//===========================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { PORT, DATABASE_URL, PRIVATE_KEY_ID, PRIVATE_KEY, CLIENT_ID } = process.env;
const projectsRouter = express.Router();
const songsRouter = express.Router({mergeParams: true});
const Projects = require('./models/projects');
const Songs = require('./models/projects');
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
app.use('/api/projects', isAuthenticated, projectsRouter);
projectsRouter.use('/:id/songs', isAuthenticated, songsRouter)



app.get('/api/*', (req, res) => res.status(404).json({message: 'That route was not found'}));
app.get('/api/*', (req, res) => res.status(404).json({message: 'That route was not found'}));

//-------------------------------------------
//index

projectsRouter.get('/', async (req, res) => {
    try {
        res.json(await Projects.find({managedBy: req.user.uid}));    
    } catch (error) {
        res.json({message: 'Please login'})
    };
});

//-------------------------------------------
//delete
projectsRouter.delete('/:id', async (req, res) => {
    try {
        res.json(await Projects.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.json(error)
    }
});

//-------------------------------------------
//update 
projectsRouter.put('/:id', async (req, res) => {
    try {
        res.json(await Projects.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.json(error)
    }
})

//-------------------------------------------
//create

projectsRouter.post('/', async (req, res) => {
    try {
        res.create(await Projects.create(req.body))
    } catch (error) {
        res.json({message: 'Please login'})
    };
});

projectsRouter.post('/:id/songs', async (req, res) => {
    try {
        const project = await Projects.findById(req.params.id);
        project.songs.push(req.body);
        await project.save();
        res.json(project);
    } catch (error) {
        console.log(error)
        res.json({message: 'Something went wrong'})
    }
})

//-------------------------------------------
//show

projectsRouter.get('/:id', async (req, res) => {
    try {
        res.json(await Projects.findById(req.params.id))
    } catch (error) {
        res.json({message: 'Please login'})
    }
});

//===========================================
//SONGS

songsRouter.get('/', async (req, res) => {
    try {
        res.json(`${req.params.id}`)
    } catch (error) {
        res.json(error)
    }
})
songsRouter.get('/:songid', async (req, res) => {
    try {
        res.json(await Projects.findById(req.params.id, req.params.songid, req.body))
    } catch (error) {
        console.log(error)
        res.json(error)
    }
    console.log(req.body)
})

//===========================================
//               LISTENERS
//===========================================

app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`)
});