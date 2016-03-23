var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
    name            : String,
    _productId      :{type: Schema.Types.ObjectId, ref: 'Product'}
});

module.exports = mongoose.model('Media', Media);