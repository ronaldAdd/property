const {User} = require('../models/user');
const {Properties } = require('../models/property');
const {Transactions} = require('../models/transaction')
const Xendit = require('xendit-node');

const express=require('express');
const router=express.Router();
const _= require ('lodash');

//getTransaction in property.co.id
  router.get('/', async (req, res) => {
      //this should be accessible by ADMIN ONLY
      const transaction = await Transactions.find().sort('date');
      res.send(transaction);
    });

  
  router.get('/home/:email', async (req, res) => {
      //this should be secured
      const transaction = await Transactions.find({email : req.params.email}).sort('date').limit(5);
      res.send(transaction);
    });

  //getTransaction by email
  router.get('/:email', async (req, res) => {
    const transaction = await Transactions.find({email : req.params.email});  
    if (!transaction) return res.status(404).send('The transactions with the given ID was not found.');  
    res.send(transaction);   
  });

//postTransaction in property.co.id
router.post('/', async (req, res) => {
  try {
    //Check to see if proeprty available
    let properties= await Properties.findOne({name : req.body.name});
    if(!properties) return res.status(400).send('Property is not registered');

    //check to see if user is available
    let user= await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('email is not registered');

    //check to see last ID
    const transactionId = await Transactions.find().sort({date:-1}).limit(1);
    const newTransactionId = Number(transactionId[0].transaction_id)+1;
    const totalPrice=(Number(req.body.price)*Number(req.body.qty));

    //adding XENDIT TRANSACTION
    const x = new Xendit({
      secretKey: 'xnd_production_CUH3PYXykThB4JJfw7nYhBZJE5dDnG7WSedgGRZoRidGi5l2okWbFDABjGccZ5',
    });

    const { Invoice } = x;
    const i = new Invoice({});
      
        let invoice = await i.createInvoice({
          externalID: Date.now().toString(),
          payerEmail: req.body.email,
          description: 'Invoice for property.co.id'+newTransactionId,
          amount: totalPrice,
          customer: {
            given_names: user.name,
            email: req.body.email,
          },
          customerNotificationPreference: {
            invoice_created: ['email'],
          },
        });
        
        let invoiceUrl=invoice.invoice_url
        let transaction = new Transactions({
          name: req.body.name,
          transaction_id: newTransactionId,
          email: req.body.email,
          qty:req.body.qty,
          price:req.body.price,
          total:totalPrice,
          redirect_url: invoiceUrl
          }
      );
      
      transaction = await transaction.save();
      res.send(invoiceUrl);
      } catch (error) {
        logger('transaction','trying to send payment to XENDIT',error)
      }
     
  });

  router.put('/:transaction_id', async (req, res) => {    
    //check to see if transaction  is available
    let transaction= await Transactions.findOne({token : req.body.transaction_id});
    if(!transaction) return res.status(400).send('transaction_id is not registered');

    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);
    //     const user = await User.findByIdAndUpdate(req.params.id,
    //     { 
    //     full_name : req.body.name,
    //     isApproved : req.body.isApproved,
    //     phone_number : req.body.phone_number,
    //     email : req.body.email,
    //     password: req.body.password
    //     }, { new: true });
    // if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send('kodok berhasil');
    });

  module.exports = router; 