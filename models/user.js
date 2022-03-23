const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema =new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },    
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:255
    },
    isApproved: {
        type: Boolean,
        default: false
      },
    ktp_image:{
        type:String
    },
    phone_number: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
      },
    date:{
        type:Date,
        default:Date.now
    },
    bank_main:{
      type:String,
      minlength:5,
      maxlength:20
    },
    rekening:{
      type:[Array],
      minlength:5,
      maxlength:20
    },
    notif_token:{
      type:String,
      minlength:5,
      maxlength:100
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    ktp: {
      type: String,
      minlength:5,
      maxlength:100
    },
    forgot_password: [{
      token: {
        type:String,
        minlength:6,
        maxlength:255
    }
    }],
  });

  userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, email : this.email ,name : this.name},config.get('jwtPrivateKey'));
    return token;
   
  }

  const User=mongoose.model('user',userSchema)

  function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      phone_number: Joi.string().min(5).max(50).required(),
      isApproved: Joi.boolean(),
      email: Joi.string().min(5).max(50).required(),
      password:Joi.string().min(5).max(255).required(),
      rekening:Joi.array(),
      bank_main:Joi.string().min(5).max(20),
      notif_token:Joi.string().min(3).max(100),
      ktp:Joi.string().min(3).max(100),
      isAdmin: Joi.boolean(),
    });
  return schema.validate(user);
};

function validateNewPassword(user) {
  const schema = Joi.object({
    new_password: Joi.string().min(5).max(255).required(),
    confirm_password: Joi.string().min(5).max(255).required().valid(Joi.ref('new_password')).label('passwords don\'t match'),
  });
return schema.validate(user);
};


function validateForgotPassword(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email()
  });
return schema.validate(user);
};


exports.User = User; 
exports.validate = validateUser;
exports.validateNewPassword = validateNewPassword;
exports.validateForgotPassword = validateForgotPassword;