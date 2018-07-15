// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var linkSchema = new Schema({
    iD: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shocks: [{
        type: String
    }]
});

var Link = mongoose.model('Link', linkSchema);

// make this available to our links in our Node applications
module.exports = Link;