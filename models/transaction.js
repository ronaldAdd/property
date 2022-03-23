const { string, date } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

const transactionSchema =new mongoose.Schema({
   name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
      },
    transaction_id: {
        type:Number,
        required: true,
        minlength: 1,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    redirect_url: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    qty:{
        type: String,
        minlength: 1,
        maxlength: 100
    },
    price:{
        type: String,
        minlength: 1,
        maxlength: 15
    },
    total:{
        type: String,
        minlength: 1,
        maxlength: 15
    },
    date:{
        type:Date,
        default:Date.now
    },
    token:{
        type: String,
        minlength: 1,
        maxlength: 50
    }
  });

  const Transactions=mongoose.model('transactions',transactionSchema)

  function validateTransactions(transaction) {
    const id = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    transaction_id: Joi.number().min(5).max(50).required(),
    email:Joi.string().min(5).max(50).required(),
    redirect_url:Joi.string().min(5).max(50),
    qty:Joi.string().min(5).max(50),
    price:Joi.string().min(5).max(50),
    total:Joi.string().min(5).max(50),
    token:Joi.string().min(1).max(50),
    
    });
  return schema.validate(transaction);
};

exports.Transactions = Transactions; 
exports.validate = validateTransactions;


const midtrans_callback =
{"va_numbers":[
    {"va_number":"124125275381572162","bank":"bri"}
],
"transaction_time":"2022-02-06 11:10:55",
"transaction_status":"settlement",
"transaction_id":"07db7b44-0e73-4c4b-b9a7-4d396a14f57d",
"status_message":"midtrans payment notification",
"status_code":"200",
"signature_key":"09a60b3a5e487036e75a57d70560abbc1b69cc66d631a4782e40fdd089b6f3d9f0158bf7fd090add961dacc512a1aacdca2a1021e8344661850a51bbbf7e4509",
"settlement_time":"2022-02-06 11:12:59",
"payment_type":"bank_transfer",
"payment_amounts":[],
"order_id":"BSM968021-event-OFF-Pal-20220206041033",
"merchant_id":"G865737905",
"gross_amount":"104400.00",
"fraud_status":"accept",
"currency":"IDR"
}
const callback=
{"va_numbers":[{"va_number":"124125275381572162","bank":"bri"}],
"transaction_time":"2022-02-06 11:10:55",
"transaction_status":"settlement",
"transaction_id":"07db7b44-0e73-4c4b-b9a7-4d396a14f57d",
"status_message":"midtrans payment notification",
"status_code":"200",
"signature_key":"09a60b3a5e487036e75a57d70560abbc1b69cc66d631a4782e40fdd089b6f3d9f0158bf7fd090add961dacc512a1aacdca2a1021e8344661850a51bbbf7e4509",
"settlement_time":"2022-02-06 11:12:59","payment_type":"bank_transfer","payment_amounts":[],
"order_id":"BSM968021-event-OFF-Pal-20220206041033",
"merchant_id":"G865737905",
"gross_amount":"104400.00",
"fraud_status":"accept",
"currency":"IDR"}