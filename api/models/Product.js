var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    designation     : String,
    description     : String,
    price           : Number,
    images          : [{type: Schema.Types.ObjectId, ref: 'Media'}],
    _scategoryId    : {type: Schema.Types.ObjectId, ref: 'subCategory'}
});

module.exports = mongoose.model('Product', Product);