const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

let playerSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Players",
  },
  title: {
    type: String,
    unique: false,
    default: ""
  }
});

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    contentType: String,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    contentType: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    contentType: String,
    minlength: 5,
    maxlength: 1024,
  },
  admin: {
    type: Boolean,
    default: false,
    required: true
  },
  teamName: {
    type: String,
    default: '',
  },
  fantasyTeam: [playerSchema],
  freeHitTeam: [playerSchema],
  leagues: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "League",
    default: [],
    required: true,
  },
  point: {
    type: [Number],
    default: [0,0,0,0,0,0,0,0,0,0,0]
  },
  keeper: {
    type: String,
  },
  freeHitKeeper: {
    type: String,
    default: ""
  },
  defender: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  freeHitDefender: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  midfielder: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  freeHitMidfielder: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  attacker: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  freeHitAttacker: {
    type: [{
      type: String,
      //ref: "Player",
    }],
    default: []
  },
  bank: {
    type: Number,
    default: 100
  },
  captain: {
    type: String,
    default: 'e'
  },
  viceCaptain: {
    type: String,
    default: 'e'
  },
  gameweek: {
    type: [{
      id: {
        type: String,
      },
      number: {
        type: Number
      }
    }],
    default: []
  },
  wildcard: {
    type: Number,
    default: 1
  },
  freeTransfer: {
    type: Number,
    default: -1,
  },
  freeHit: {
    type: Number,
    default: 1
  },
  benchBoost: {
    type: Number,
    default: 1
  },
  tripleCaptain: {
    type: Number,
    default: 1
  },
  cost: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  token: {
    type: {
      auth: {
        type: Number
      },
      valid: {
        type: Date
      }
    }
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id : this._id, admin: this.admin}, process.env.JWT_PRIVATE_KEY);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
      teamName: Joi.string(),
      points: Joi.array(),
      leagues: Joi.array(),
    });
  
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;