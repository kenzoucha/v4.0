var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    designation     : {
                    type: String,
                    required: [true, 'La désignation catégorie ne doit pas etre vide'],
                    validate: {
                        validator: function(v){
                            return v.length > 5;
                        },
                        message : 'La désignation doit etre minimum 5 caractères'
                    }
    },
    description     :  String,
    subCats         : [{type: Schema.Types.ObjectId, ref: 'subCategory'}]
});
module.exports = mongoose.model('Category', Category);