// const JwtStratergy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const sqlcon = require('./../config/database');
//
// module.exports = function (passport) {
//     let opts={};
//     opts.jwtFromRequest=ExtractJwt.fromAuthHeaderWithScheme('jwt');
//     opts.secretOrKey="LinkShockSecret";
//     passport.use(new JwtStratergy(opts, (jwt_payload,done)=>{
//         // console.log(jwt_payload);
//         if(jwt_payload.type==="Passenger") {
//             sqlcon.connection.query("SELECT * FROM user WHERE email=?", [jwt_payload.data.email], function (error, respsn, fields) {
//                 if (error) {
//                     return done(error, false);
//                 }
//                 else {
//                     if (respsn.length === 0) {
//                         console.log("User not found");
//                         return done(null, false);
//                     }
//                     else {
//                         return done(null, respsn[0]);
//                     }
//                 }
//             });
//         }
//         else if(jwt_payload.type==="NTC") {
//             sqlcon.connection.query("SELECT * FROM ntc WHERE email=?", [jwt_payload.data.email], function (error, resntc, fields) {
//                 if (error) {
//                     return done(error, false);
//                 }
//                 else {
//                     if (resntc.length === 0) {
//                         console.log("User not found");
//                         return done(null, false);
//                     }
//                     else {
//                         return done(null, resntc[0]);
//                     }
//                 }
//             });
//         }
//         else if(jwt_payload.type==="Owner") {
//             sqlcon.connection.query("SELECT * FROM owner WHERE email=?", [jwt_payload.data.email], function (error, resntc, fields) {
//                 if (error) {
//                     return done(error, false);
//                 }
//                 else {
//                     if (resntc.length === 0) {
//                         console.log("User not found");
//                         return done(null, false);
//                     }
//                     else {
//                         return done(null, resntc[0]);
//                     }
//                 }
//             });
//         }
//         else if(jwt_payload.type==="Operator") {
//             sqlcon.connection.query("SELECT * FROM operator WHERE email=?", [jwt_payload.data.email], function (error, resntc, fields) {
//                 if (error) {
//                     return done(error, false);
//                 }
//                 else {
//                     if (resntc.length === 0) {
//                         console.log("User not found");
//                         return done(null, false);
//                     }
//                     else {
//                         return done(null, resntc[0]);
//                     }
//                 }
//             });
//         }
//     }));
// };
//
