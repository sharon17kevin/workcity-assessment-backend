const Joi = require("joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  progress: {
    type: String,
    required: true,
  },
  teamMembers: {
    type: [{
      type: String,
    }],
    required: true,
    default: []
  },
  budget: {
    type: String,
    required: true,
  },
  tag: {
    type: [{
      type: String,
    }],
    required: true,
    default: []
  },
});

const Project = mongoose.model("Project", projectSchema);

function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(255).required().email(),
    status: Joi.string().min(2).max(50).required(),
    priority: Joi.string().min(2).max(50).required(),
    progress: Joi.string().min(2).max(50).required(),
    budget: Joi.number().min(0),
    tag: Joi.array(),
    teamMembers: Joi.array()
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validateProject = validateProject;
exports.clientProject = clientProject;
