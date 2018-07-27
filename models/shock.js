// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var shockSchema = new Schema({
    iD: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ada_key: { type: String, required: true },
    on_time: { type: String, required:true},
    can_on: { type: Boolean, required: true },
    off_time: { type: String, required: true },
    can_off: { type: Boolean, required: true },

});

var Shock = mongoose.model('Shock', shockSchema);

// make this available to our shocks in our Node applications
module.exports = Shock;