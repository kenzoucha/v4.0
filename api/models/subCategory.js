var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SCategory = new Schema({
    designation     : String,
    description     : String,
    _categoryId     : {type: Schema.Types.ObjectId, ref: 'Category'},
    products        : [{type: Schema.Types.ObjectId, ref: 'Product'}],
    fields: [Schema.Types.Mixed]
});
module.exports = mongoose.model('subCategory', SCategory);