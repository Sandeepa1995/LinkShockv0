const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const serveStatic = require('serve-static')
const schedule = require('node-schedule');
const Shock = require('./models/shock');
const axios = require('axios');
const moment = require('moment');
const mongoose = require('mongoose');
const hhmmss = require('hh-mm-ss');

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
app.use("/",link_routes);

//Mongoose connection
mongoose.connect("mongodb://"+config.user+":"+config.pass+"@ds159400.mlab.com:59400/linkshock");
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use("/", serveStatic ( path.join (__dirname, '/client/dist') ) );

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/client/dist/index.html')
});

//Index Route
// app.get('*',(req,res)=>{
//     res.send({success:false, msg:"unknown request"})
//     // res.sendFile(path.join(__dirname,'public/index.html'));
// });
//
// app.post('/register',(req,res)=>{
//     console.log(req.body);
//     res.send({success:true, msg:"got it"})
//     // res.sendFile(path.join(__dirname,'public/index.html'));
// });
//
// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'public/index.html'));
// });

//Start Server
app.listen(port,()=>{
    // var offset = new Date().getTimezoneOffset();
    console.log("Server started on "+port);
    // console.log(hhmmss.fromS(mod(hhmmss.toS(moment(new Date()).format('HH:mm')) + offset, 1440)));
});

function mod(n, p)
{
    if ( n < 0 )
        n = p - Math.abs(n) % p;
    return n % p;
}

var j1 = schedule.scheduleJob('30 * * * *', function(){
    var offset = new Date().getTimezoneOffset();
    var timeNow = mod(hhmmss.toS(moment(new Date()).format('HH:mm')) + offset, 1440);
    Shock.find({}, function(err, shocks) {
        if (err) throw err;

        shocks.forEach(shock =>{
            if (shock.can_on && (Math.abs(hhmmss.toS(shock.on_time)-timeNow))<10){
                axios({
                    method: 'post',
                    url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + shock.ada_key + '.state/data',
                    data: {
                        value: 'ON'
                    },
                    headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                }).then((response) => {
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            if (shock.can_off && (Math.abs(hhmmss.toS(shock.off_time)-timeNow))<10){
                axios({
                    method: 'post',
                    url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + shock.ada_key + '.state/data',
                    data: {
                        value: 'OFF'
                    },
                    headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                }).then((response) => {
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    });
});
var j2 = schedule.scheduleJob('0 * * * *', function(){
    var offset = new Date().getTimezoneOffset();
    var timeNow = mod(hhmmss.toS(moment(new Date()).format('HH:mm')) + offset, 1440);
    Shock.find({}, function(err, shocks) {
        if (err) throw err;

        shocks.forEach(shock =>{
            // console.log(shock.iD);
            // console.log(shock.can_on);
            // console.log(hhmmss.toS(shock.on_time));
            // console.log(timeNow);
            // console.log((Math.abs(hhmmss.toS(shock.on_time)-timeNow)));
            // console.log('https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + shock.ada_key + '.state/data');
            if (shock.can_on && (Math.abs(hhmmss.toS(shock.on_time)-timeNow))<10){
                axios({
                    method: 'post',
                    url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + shock.ada_key + '.state/data',
                    data: {
                        value: 'ON'
                    },
                    headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                }).then((response) => {
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            if (shock.can_off && (Math.abs(hhmmss.toS(shock.off_time)-timeNow))<10){
                axios({
                    method: 'post',
                    url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + shock.ada_key + '.state/data',
                    data: {
                        value: 'OFF'
                    },
                    headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                }).then((response) => {
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    });
});
