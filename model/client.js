const Joi = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
  projectCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Client = mongoose.model("Client", clientSchema);

function validateClient(client) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    role: Joi.string().min(2).max(50).required(),
    department: Joi.string().min(2).max(50).required(),
    status: Joi.string().min(2).max(50).required(),
    projectCount: Joi.number().min(0),
  });

  return schema.validate(client);
}

exports.Client = Client;
exports.validateClient = validateClient;
exports.clientSchema = clientSchema;
