const mongoose = require('mongoose');
const clients = require('./routes/clients')
const projects = require('./routes/projects')
const dotenv = require('dotenv');
dotenv.config();
const config = require("config");
 
const express = require('express');
const app = express();
require('./prod')(app);

mongoose.connect('mongodb://localhost/workcity')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err))

app.use(express.json());
app.use('/api/clients', clients);
app.use('/api/projects', projects);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
