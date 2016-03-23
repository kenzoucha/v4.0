var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = Schema({
    username    :  String,
    password     : String
});

module.exports = mongoose.model('User', personSchema);