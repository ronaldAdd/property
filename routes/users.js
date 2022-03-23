const {User, validate} = require('../models/user');
const express=require('express');
const router=express.Router();
const _= require ('lodash');
const bcrypt = require('bcrypt');

  router.get('/', async (req, res) => {
    //this should be accessible by ADMIN ONLY    
    const users = await User.find().sort('name');
    res.send(users);
  });

  router.get('/id/:id', async (req, res) => {
    const user = await User.findById(req.params.id);  
    if (!user) return res.status(404).send('The user with the given ID was not found.');  
    res.send(_.pick(user,['_id','name','email','rekening','phone_number','ktp']));
  });

  router.get('/bank/:id', async (req, res) => {
    const user = await User.findById(req.params.id);  
    if (!user) return res.status(404).send('The user with the given ID was not found.');  
    res.send(_.pick(user,['rekening']));
  });

  //create new user
  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let checkUser= await User.findOne({email : req.body.email});
    if(checkUser) return res.status(400).send('User already registered');

    let user = new User(_.pick(req.body,['name','email','password','phone_number','isApproved']));

    //initializing bcrypt encryption for password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    user.isApproved= false;
    user = await user.save();
    
    //creating JWT token
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
  });

  router.put('/:id', async (req, res) => {
 
    const checkUser = await User.findById(req.params.id); 
    if(!checkUser) return res.status(400).send('no such user registered');

    // should add JWT ID as well as checker
    const user = await User.findByIdAndUpdate(req.params.id,
      { 
        name : req.body.name,
        phone_number : req.body.phone_number,
        ktp:req.body.ktp,

      }, { new: true });

    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(_.pick(user,['_id','name','phone_number','ktp']));
  });

  router.put('/bank/:id', async (req, res) => {

      let checkUser= await User.findOne({_id : req.params.id});
      if(!checkUser) return res.status(400).send('no such user registered');

      const user = await User.findByIdAndUpdate(req.params.id,
      { 
        rekening : {bank:req.body.bank, kode_bank:req.body.kode_bank, nomer_rekening:req.body.rekening}
        
      }, { new: true });
      
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    
    res.send({ok:true});
  });

  // router.delete('/:id', async (req, res) => {
  //   const user = await User.findByIdAndRemove(req.params.id);  
  //   if (!user) return res.status(404).send('The user with the given ID was not found.');  
  //   res.send(user);
  // });


  module.exports = router; 
