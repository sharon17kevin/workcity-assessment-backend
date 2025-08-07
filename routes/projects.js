const {Project, validProject, validateProject} = require('../model/project')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validProject(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let project = new Project({ 
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      progress: req.body.progress,
      teamMembers: req.body.teamMembers,
      budget: req.body.budget,
      tag: req.body.tag
    });
    project = await project.save();
    
    res.send(project);
});

router.put('/', async (req, res) => {
    const { error } = validateProject(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const project = await Project.findByIdAndUpdate(req.query.id,
      { 
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        progress: req.body.progress,
        teamMembers: req.body.teamMembers,
        budget: req.body.budget,
        tag: req.body.tag
      }, { new: true });
  
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    
    res.send(project);
});

router.delete('/', async (req, res) => {
    const project = await Project.findByIdAndRemove(req.query.id);
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

router.get('/one', async (req, res) => {
  if (req.query.id) {
    const project = await Project.find({
      _id: {
        $in: req.query.id
      }
    });
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
  } else {
    const project = await Project.find().sort('name');
    res.send(project);
  }
});

router.get('/', async (req, res) => {
  if (req.query.id) {
    const project = await Project.findById(req.query.id);
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
  } else {
    const project = await Project.find().sort('name');
    res.send(project);
  }
})

module.exports = router;