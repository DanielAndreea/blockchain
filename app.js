var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var ethRouter = require('./routes/eth');
var patientController = require('./routes/patient.controller');
var doctorController = require('./routes/doctor.controller');
var userController = require('./routes/user.controller');
var contractController = require('./routes/contract.controller');
var encryptController = require('./routes/encrypt.controller');
var liverController = require('./routes/liver.controller');
var registryController = require('./routes/medicalRegistry.controller');
// var requestsController = require('./routes/requests.controller');

//WEB 3
var web3Lib = require('web3');

//GANACHE
// var web3 = new web3Lib("http://localhost:7545");

// LOCAL PARITY NODE
var web3 = new web3Lib("http://localhost:8540");

global.web3 = web3;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");

    next();
});

app.use('/', indexRouter);
app.use('/eth', ethRouter);
app.use('/patient', patientController);
app.use('/doctor', doctorController);
app.use('/user', userController);
app.use('/contract', contractController);
app.use('/encrypt', encryptController);
app.use('/liver', liverController);
app.use('/medicalRegistry', registryController);
// app.use('/requests', requestsController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(8080, () =>{
  console.log("Server is listening on port 8080.");
  connectToDatabase();
})
//DATABASE CONNECTION
function connectToDatabase(){
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/ethmed?authSource=ethmed');

  mongoose.connection.on('connected', function () {
    console.log("Connected to 'ethmed' database.");
  });

  mongoose.connection.on('error', function (err) {
    console.log("Mongoose connection error.");
  });

  mongoose.connection.on('disconnected', function () {
    console.log("Mongoose disconnected.");
  });

}

module.exports = app;
