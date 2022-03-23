const {Properties, validate} = require('../models/property');
const express=require('express');
const router=express.Router();
const _= require ('lodash');
const {logger} =require('../middleware/logger')

  router.get('/', async (req, res) => {
    const properties = await Properties.find().sort('name');
    res.send(properties);
  });

  router.get('/home', async (req, res) => {
    const properties = await Properties.find().sort('_id').limit(5);
    console.log(properties[1].name)
    res.send(properties);
    // res.send(_.pick(properties,['_id','name','images']));  
    // console.log(_.pick(properties,['_id','name']))    
    // res.send(_.pick(properties,['_id','name']));
    //res.send(_.pick(user,['_id','name','email','rekening','phone_number']));
    //res.send(_.pick(user,['_id','name','email','rekening','phone_number']));
  });

  //create new property
  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error){
      logger('post','properties validate Error',error.details[0].message)
      return res.status(400).send(error.details[0].message);
    } 

    let properties= await Properties.findOne({name : req.body.name});
    if(properties) return res.status(400).send('Property already registered');

    //body to enter those id from backend such as - property_name,description,image etc
    let property = new Properties(_.pick(req.body,['name','table','isAvailable','images','pricePerLot','description','profit_per_year','total_lot','periode_profit','type']));
    property = await property.save();
  
    res.send(_.pick(property,['_id','name','table','isAvailable','images','pricePerLot','description','profit_per_year','total_lot','periode_profit','type']));
  });

  router.put('/:id', async (req, res) => {
    console.log('body =',req.body)
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

      const [property] = await Properties.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        pricePerLot: req.body.pricePerLot,
        isAvailable: req.body.isAvailable,
        description: req.body.description,
        profit_per_year: req.body.profit_per_year,
        total_lot: req.body.total_lot,
        periode_profit: req.body.periode_profit,
        type: req.body.type
      }, { new: true });
    if (!property) return res.status(404).send('The user with the given ID was not found.');
  res.send(property);
  });

//   router.delete('/:id', async (req, res) => {
//     const user = await User.findByIdAndRemove(req.params.id);  
//     if (!user) return res.status(404).send('The user with the given ID was not found.');  
//     res.send(user);
//   });

  router.get('/:id', async (req, res) => {
    const property = await Properties.findById(req.params.id);  
    if (!property) return res.status(404).send('The property with the given ID was not found.');  
    res.send(property);
  });
  

  module.exports = router; 
