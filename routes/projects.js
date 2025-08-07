const {Project, validProject} = require('../model/project')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateClient(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let client = new Client({ 
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      department: req.body.department,
      joinDate: req.body.joinDate,
      status: req.body.status,
      projectCount: req.body.projectCount
    });
    client = await client.save();
    
    res.send(client);
});

router.put('/', async (req, res) => {
    const { error } = validateClient(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const client = await Client.findByIdAndUpdate(req.query.id,
      { 
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        department: req.body.department,
        joinDate: req.body.joinDate,
        status: req.body.status,
        projectCount: req.body.projectCount
      }, { new: true });
  
    if (!client) return res.status(404).send('The client with the given ID was not found.');
    
    res.send(client);
});

router.delete('/', async (req, res) => {
    const client = await Client.findByIdAndRemove(req.query.id);
    if (!client) return res.status(404).send('The client with the given ID was not found.');
    res.send(client);
});

router.get('/one', async (req, res) => {
  if (req.query.id) {
    const client = await Client.find({
      _id: {
        $in: req.query.id
      }
    });
    if (!client) return res.status(404).send('The client with the given ID was not found.');
    res.send(client);
  } else {
    const client = await Client.find().sort('name');
    res.send(client);
  }
});

router.get('/', async (req, res) => {
  if (req.query.id) {
    const client = await Client.findById(req.query.id);
    if (!client) return res.status(404).send('The client with the given ID was not found.');
    res.send(client);
  } else {
    const client = await Client.find().sort('name');
    res.send(client);
  }
})

module.exports = router;