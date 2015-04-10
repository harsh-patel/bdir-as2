// db link
var mongoose = require('mongoose');

// define the product model (fields and data types)
var ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number
});

// make the model public so other files can access it
module.exports = mongoose.model('Product', ProductSchema);