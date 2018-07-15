const JwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');


module.exports = function (passport) {
    let opts={};
    opts.jwtFromRequest=ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey="LinkShockSecret";
    passport.use(new JwtStratergy(opts, (jwt_payload,done)=>{
        console.log(jwt_payload);
        User.findOne({email:jwt_payload.email}, (err, userVal)=> {
            console.log(err);
            console.log(userVal);
            if(err){
                return done(err, false);
            } else if(userVal){
                return done(null, userVal);
            } else{
                return done(null, false);
            }
        });
    }));
};

