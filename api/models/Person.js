/**
 * Created by Kenza on 14/03/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = new Schema({
    name: String
});
var Person= new Schema({

    images: [Image],
    username: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    birthdate: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});
module.exports = mongoose.model('Person', Person);