const express = require('express');
const { findById } = require('../models/projects');
const projectsRouter = express.Router();
const Projects = require('../models/projects');
const Songs = require('../models/songs');

//===========================================
//               ROUTES
//===========================================

//-------------------------------------------
//index
projectsRouter.get('/', async (req, res) => {
    try {
        res.json(await Projects.find({}));    
    } catch (error) {
        res.json(error)
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
        res.json(error)
    };
});

//-------------------------------------------
//show

projectsRouter.get('/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        res.json(await Projects.findById(req.params.id))
    } catch (error) {
        res.json(error)
    }
})


module.exports = projectsRouter;