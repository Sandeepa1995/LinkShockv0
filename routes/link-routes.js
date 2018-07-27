const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Link = require('../models/link');
const Shock = require('../models/shock');
const async = require("async");
const axios = require('axios');

//Register
router.post('/register',(req,res,next)=> {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            var new_user = new User({
                name:req.body.name,
                email: req.body.email,
                password: hash
            });

            new_user.save((err) => {
                if (err) throw err;
                return res.json({success:true,msg:req.body.name + "successfully added to the system."});
            });
        });
    });
});


//Authenticate
router.post('/authenticate',(req,res,next)=>{
    User.findOne({ email: req.body.email }, (err, userVal)=> {
        if (err)
        {
            console.log(err);
            res.json({success: false, msg: "Query Error"});
        }
        else if(!userVal){
            console.log("User not found");
            return res.json({success:false,msg:"User not registered in the system"})
        } else {
            // console.log(JSON.stringify(userVal.password));
            bcrypt.compare(req.body.password, userVal.password, (error, resp)=> {
                if (error)
                {
                    console.log(error);
                    return res.json({success: false, msg: "Query Error"});
                }
                else if (resp){
                    // console.log(userVal);
                    const token = jwt.sign(userVal.toJSON(),"LinkShockShockingSecret",{
                        expiresIn: 604800 //1 week
                    });
                    return res.json({success:true,token:token,user:{email:userVal.email,name:userVal.name,id:userVal._id}})
                }
                else{
                    return res.json({success:false,msg:"Incorrect Password"});
                }
            });
        }
    });
});

//Add link (new) to the database
router.post('/link',(req,res,next)=> {
    bcrypt.compare(req.body.admin_pass, "$2a$10$4N7mP6KXh2Imj/eWFk3f/u8C.8oqkyLdJ0rwL8baWYgfMhwGEgOCC", (error, resp)=> {
        if (error){
            return res.json({success: false, msg: "Error"});
        }
        if(resp) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    var new_link = new Link({
                        iD: req.body.id,
                        password: hash,
                        shocks: []
                    });

                    new_link.save((err) => {
                        if (err) throw err;
                        return res.json({success: true, msg: "Link successfully added to the system."});
                    });
                });
            });
        }
        else {
            return res.json({success: false, msg: "Incorrect admin password"});
        }
    });
});

//Add link to the user
router.post('/linksetup',(req,res,next)=> {
    jwt.verify(req.headers.authorization, "LinkShockShockingSecret", (err, decoded) => {
        if (err) {
            return res.json({success:false,msg:"Unauthorized"});
        } else {
            Link.findOne({ iD: req.body.link_id }, (err, linkVal)=> {
                if (err) {
                    console.log(err);
                    res.json({success: false, msg: "Query Error"});
                }
                else if(!linkVal){
                    console.log("Link not found");
                    return res.json({success:false,msg:"Link not registered in the system"})
                } else {
                    bcrypt.compare(req.body.password, linkVal.password, (error, resp)=> {
                        if (error)
                        {
                            console.log(error);
                            return res.json({success: false, msg: "Query Error"});
                        }
                        else if (resp){
                            User.findOne({_id:req.body.user_id}, (errCheck, userCheck) => {
                                if (errCheck){
                                    return res.json({success: false, msg: "Query Error"});
                                }
                                else if(userCheck.links.length > 0 && userCheck.links.indexOf(req.body.link_id)>-1){
                                    return res.json({success: false, msg: "Link already added to the user"});
                                } else{
                                    User.findOneAndUpdate({_id:req.body.user_id}, { $push: { links: req.body.link_id } }, (errAdd)=>{
                                        if(errAdd) {
                                            console.log(errAdd);
                                            return res.json({success: false, msg: "Query Error"});
                                        } else {
                                            // Link.findOneAndUpdate({ iD: req.body.link_id }, { shocks: [] }, (errorRefresh, refh) = > {
                                            //     if (errorRefresh) {
                                            //         console.log(errAdd);
                                            //         return res.json({success: false, msg: "Query Error"});
                                            //     } else {
                                            //         return res.json({success: true, msg: "Link added to the account."});
                                            //     }
                                            // });
                                            return res.json({success: true, msg: "Link added to the account."});
                                        }
                                    })
                                }
                            });
                        }
                        else{
                            return res.json({success:false,msg:"Incorrect Password"});
                        }
                    });
                }
            });
        }
    });
});

//Get the links of the owner
router.post('/links',(req,res,next)=> {
    jwt.verify(req.headers.authorization, "LinkShockShockingSecret", (err, decoded) => {
        if (err) {
            return res.json({success:false,msg:"Unauthorized"});
        } else {
            User.findOne( {_id: req.body.user_id}, (err, userFound) =>{
               if(err){
                   console.log(err);
                   res.json({success: false, msg: "Query Error"});
               } else{
                   let linksToReturn=[];

                   async.forEachOf(userFound.links, (link, key, callback) => {
                       Link.findOne({iD:link}, (error, linkToAdd)=>{
                           if(error){
                               console.log(error);
                               return callback(error);
                           } else {
                               let linkAltered = {
                                   iD:linkToAdd.iD,
                                   shocks:linkToAdd.shocks
                               };
                               linksToReturn.push(linkAltered);
                               callback();
                           }
                       });
                   }, err => {
                       if (err){
                           res.json({success: false, msg: "Query Error"});
                       }
                       return res.json({success: true, links: linksToReturn});
                   });
               }
            });
        }
    });
});

//Add shock to the link
router.post('/shocksetup',(req,res,next)=> {
    jwt.verify(req.headers.authorization, "LinkShockShockingSecret", (err, decoded) => {
        if (err) {
            return res.json({success:false,msg:"Unauthorized"});
        } else {
            Shock.findOne({ iD: req.body.shock_id }, (err, shockVal)=> {
                if (err) {
                    console.log(err);
                    res.json({success: false, msg: "Query Error"});
                }
                else if(!shockVal){
                    console.log("Shock not found");
                    return res.json({success:false,msg:"Shock not registered in the system"})
                } else {
                    bcrypt.compare(req.body.password, shockVal.password, (error, resp)=> {
                        if (error)
                        {
                            console.log(error);
                            return res.json({success: false, msg: "Query Error"});
                        }
                        else if (resp){
                            Link.findOne({iD:req.body.link_id}, (errCheck, linkCheck) => {
                                if (errCheck){
                                    console.log(error);
                                    return res.json({success: false, msg: "Query Error"});
                                }
                                else if(linkCheck.shocks.length > 0 && linkCheck.shocks.indexOf(req.body.shock_id)>-1){
                                    return res.json({success: false, msg: "Shock already added to the link"});
                                } else{
                                    Link.findOneAndUpdate({iD:req.body.link_id}, { $push: { shocks: req.body.shock_id } }, (errAdd)=>{
                                        if(errAdd) {
                                            console.log(errAdd);
                                            return res.json({success: false, msg: "Query Error"});
                                        } else {
                                            return res.json({success: true, msg: "Shock added to the link."});
                                        }
                                    })
                                }
                            });
                        }
                        else{
                            return res.json({success:false,msg:"Incorrect Password"});
                        }
                    });
                }
            });
        }
    });
});

//Get the data of a shock
router.post('/shockdata',(req,res,next)=> {
    jwt.verify(req.headers.authorization, "LinkShockShockingSecret", (err, decoded) => {
        if (err) {
            return res.json({success:false,msg:"Unauthorized"});
        } else {
            Shock.findOne( {iD: req.body.shock_id}, (err, shockFound) =>{
                if(err){
                    console.log(err);
                    res.json({success: false, msg: "Query Error"});
                } else{
                    let shock_returned = {
                        iD: shockFound.iD,
                        ada_key: shockFound.ada_key,
                        on_time: shockFound.on_time,
                        off_time: shockFound.off_time,
                        can_on: shockFound.can_on,
                        can_off: shockFound.can_off
                    };
                    return res.json({success: true, shock: shock_returned});
                }
            });
        }
    });
});

//Get the data of a shock
router.post('/shockstate',(req,res,next)=> {
    jwt.verify(req.headers.authorization, "LinkShockShockingSecret", (err, decoded) => {
        if (err) {
            return res.json({success:false,msg:"Unauthorized"});
        } else {
            Shock.findOneAndUpdate( {iD: req.body.shock_id}, {state: req.body.state} , (err) =>{
                if(err){
                    console.log(err);
                    res.json({success: false, msg: "Query Error"});
                } else{
                    return res.json({success: true});
                }
            });
        }
    });
});


//Add shock (new) to the database
router.post('/shock',(req,res,next)=> {
    bcrypt.compare(req.body.admin_pass, "$2a$10$4N7mP6KXh2Imj/eWFk3f/u8C.8oqkyLdJ0rwL8baWYgfMhwGEgOCC", (error, resp)=> {
        if (error){
            return res.json({success: false, msg: "Error"});
        }
        if(resp) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    var new_shock = new Shock({
                        iD:req.body.id,
                        password: hash,
                        ada_key:req.body.ada_key,
                        can_on: false,
                        can_off:false,
                        on_time: '00:00',
                        off_time: '00:00'
                    });

                    new_shock.save((err) => {
                        if (err) throw err;
                        axios({
                            method: 'post',
                            url: 'https://io.adafruit.com/api/v2/Sandeepa1995/groups',
                            data: {
                                name: req.body.ada_key,
                            },
                            headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                        }).then((response) => {
                            axios({
                                method: 'post',
                                url: 'https://io.adafruit.com/api/v2/Sandeepa1995/groups/'+req.body.ada_key+'/feeds',
                                data: {
                                    name: 'state',
                                    key: 'state'
                                },
                                headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                            }).then((response) => {
                            })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            axios({
                                method: 'post',
                                url: 'https://io.adafruit.com/api/v2/Sandeepa1995/groups/'+req.body.ada_key+'/feeds',
                                data: {
                                    name: 'values',
                                    key: 'values'
                                },
                                headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
                            }).then((response) => {
                            })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        })
                            .catch(function (error) {
                                console.log(error);
                            });
                        return res.json({success:true,msg:"Shock successfully added to the system."});
                    });
                });
            });
        }
        else {
            return res.json({success: false, msg: "Incorrect admin password"});
        }
    });
});

//Add shock (new) to the database
router.get('/welcome',(req,res,next)=> {
    return res.json({success: true, msg:"Welcome to LinkShock Web"})
});

module.exports = router;