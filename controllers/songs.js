const express = require('express');
const songsRouter = express.Router();
const Projects = require('../models/projects');

//===========================================
//               ROUTES
//===========================================

//-------------------------------------------
//index
songsRouter.get('/', async (req, res) => {
    try {
        res.json(await Songs.find({}));
    } catch (error) {
        res.json(error);
    }
});

//-------------------------------------------
//delete
songsRouter.delete('/:id', async (req, res) => {
    try {
        res.json(await Songs.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.json(error);
    }
});

//-------------------------------------------
//create
songsRouter.put('/:id', async (req, res) => {
    try {
        res.json(await Songs.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        res.json(error);
    }
});


//-------------------------------------------
//create
songsRouter.post('/', async (req, res) => {
    try {
        res.json(await Songs.create(req.body));
    } catch (error) {
        res.json(error);
    }
});

//-------------------------------------------
//show
songsRouter.get('/:id', async (req, res) => {
    try {
        res.json(await Songs.findById(req.params.id));
    } catch (error) {
        res.json(error);
    }
});


module.exports = songsRouter;