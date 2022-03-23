const Joi = require('joi');
const mongoose = require('mongoose');

const propertySchema =new mongoose.Schema({
   name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
    isAvailable: {
        type: Boolean,
        default: true
      },
    pricePerLot:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    images:{
        type:[Array],
        required:true
    },
    table: {
        type: [Array],
        required: true,
      },
    description:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },
    profit_per_year:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
    },
    total_lot:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
    },
    periode_profit:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
    },
    type :{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    date:{
      type:Date,
      default:Date.now
  }
  });

  const Properties=mongoose.model('properties',propertySchema)
  function validateProperty(properties) {
    const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    pricePerLot: Joi.string().min(5).max(30).required(),
    isAvailable: Joi.boolean(),
    table: Joi.array(),
    images:Joi.array().min(1).max(255),
    description:Joi.string().min(5).max(1000).required(),
    profit_per_year:Joi.string().min(1).max(5).required(),
    total_lot:Joi.string().min(1).max(5).required(),
    periode_profit:Joi.string().min(1).max(3).required(),
    type:Joi.string().min(3).max(20).required()
    });
  return schema.validate(properties);
};

exports.Properties = Properties; 
exports.validate = validateProperty;