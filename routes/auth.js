const {User, validateNewPassword, validateForgotPassword} = require('../models/user');
const express=require('express');
const router=express.Router();
const _= require ('lodash');
const bcrypt = require('bcrypt');
const Joi=require('joi');
const pushNotif = require('../function/push-notif')
const mailgun = require('../function/mail')


  //create new user
  router.post('/', async (req, res) => {
    
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let checkUser= await User.findOne({email : req.body.email});
    if(!checkUser) return res.status(400).send('invalid email or password');
    
    const validPassword = await bcrypt.compare(req.body.password, checkUser.password);
    if(!validPassword) return res.status(400).send('invalid email or password');
    
    //inseting notiftoken
    const user = await User.findOneAndUpdate({email:req.body.email},
      {         
        notif_token : req.body.notif_token
      }, { new: true });

      //please make sure you change jwt if you change this
    //generateAuthtoken is located in user.js
    const token=checkUser.generateAuthToken();
    res.send(token);
  });


  router.get('/forgot-password', async (req, res) => {
    const { error } = validateForgotPassword(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let checkUser= await User.findOne({email : req.body.email});
    if(!checkUser) return res.status(400).send('invalid email or password');
    const salt = await bcrypt.genSalt(15);
    let randomToken= await bcrypt.hash('indonesiaTanahAirku'+checkUser.email,salt);

    const update ={ $push: {forgot_password : [{token : randomToken }]} };
    const addNewUpdate = await User.findOneAndUpdate({email : req.body.email},update);

    //token push
    let expoPushNotif = new pushNotif(checkUser.notif_token);
    let data=[]
    data.push({"title" : "The reset password link has been sent to your email address","body" : "forgot password", "data" : {"_displayInForeground":true } })
    let message = expoPushNotif.send(data);

    //sending email to client
    let dataEmail=[]
    dataEmail.push({"to" : checkUser.email,"from" : 'support@example.com',"type" : 'forgot-password',"subject" : "Your property.co.id password reset request","body" : "<div class=\"entry\"> <p>A request has been received to change the password for your property.co.id account.</p>"+ '<a href="http://localhost:3030/api/auth/reset-password?token='+randomToken + '" rel="noopener noreferrer">Reset Password</a>' +"<div class=\"body\"></div> </div>"
  })
    let statusEmail =  await mailgun.sendEmail(dataEmail)
    console.log(statusEmail)
    res.status(200).send(statusEmail);
  })




  router.get('/reset-password', async (req, res) => {
    const { error } = validateNewPassword(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let checkUser = await User.find({"forgot_password" : {"$elemMatch" : {"token" : req.query.token} } },{"forgot_password.$":1,"_id":1,"email" : 1});
    if(!checkUser || checkUser.length===0) return res.status(400).send('invalid token');

    const salt = await bcrypt.genSalt(10);
    let new_password= await bcrypt.hash(req.body.new_password,salt);

    const user = await User.findOneAndUpdate({email:checkUser[0].email}, { password: new_password});
      if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.status(200).send({"message" : 'Your password was successfully changed,Please log in'})
  })



  router.post('/send-notification', async (req, res) => {
    let expoPushNotif = new pushNotif(req.body.to);
   
    let data=[]
    data.push({"title" : req.body.title,"body" : req.body.body, "data" : req.body.data })
    let message = expoPushNotif.send(data);

    res.status(200).send(message)
  })



  function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(50).required(),
      password:Joi.string().min(5).max(255).required(),
      notif_token:Joi.string().min(0).max(100)

    });
  return schema.validate(req);
};

module.exports = router; 
