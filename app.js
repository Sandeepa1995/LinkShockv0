const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const mongoose = require('mongoose');

const app=express();

const link_routes = require('./routes/link-routes');

const jwt=require('jsonwebtoken');

// //Port Number
const  port=process.env.PORT || 3000;

//Config file
const config = require('./config.json');

//CORS Middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser Middleware
app.use(bodyParser.json({limit: '5mb'}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Routes
app.use("",link_routes);

//Mongoose connection
mongoose.connect("mongodb://"+config.user+":"+config.pass+"@ds159400.mlab.com:59400/linkshock");
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Index Route
app.get('*',(req,res)=>{
    res.send({success:false, msg:"unknown request"})
    // res.sendFile(path.join(__dirname,'public/index.html'));
});
//
// app.post('/register',(req,res)=>{
//     console.log(req.body);
//     res.send({success:true, msg:"got it"})
//     // res.sendFile(path.join(__dirname,'public/index.html'));
// });

// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'public/index.html'));
// });

//Start Server
app.listen(port,()=>{
    console.log("Server started on "+port);
});
