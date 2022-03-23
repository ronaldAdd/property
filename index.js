const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet  = require('helmet');
const mongoose = require('mongoose');
const config = require('config');
const {logger}=require('./middleware/logger')
var cors = require('cors')


const port = process.env.PORT ||3030;
console.log('masukkk')
if(!config.get('jwtPrivateKey')){
  logger('jwtPrivateKey','Running Server','FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1);
}

//router
const courses=require('./routes/courses');
const home=require('./routes/home');
const users=require('./routes/users');
const auth=require('./routes/auth');
const properties=require('./routes/properties');
const transaction=require('./routes/transactions');

//setting express functions
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());

//router object
app.use('/api/courses', courses);
app.use('/',home);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/api/properties',properties);
app.use('/api/transaction',transaction);

//setting PUG / HTML views callback
app.set('view engine','pug');

//get what environment node at
console.log('NODE_ENV:',process.env.NODE_ENV)
console.log(app.get('env'));
if(app.get('env')=== 'development'){
app.use(morgan('tiny'));
console.log('morgan enabled...');
}


//configuration
// console.log('Application name ' + config.get('name'));
// console.log('Mail Server ' + config.get('mail.host'));
// console.log('Mail password ' + config.get('mail.password'));

//DB connection
mongoose.connect(config.get('mongoDbConnection'))
.then(()=> console.log('connected to mongodb...'))
.catch(err => logger('db error','cant connect to mongodb', err));


//set port to listen
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })