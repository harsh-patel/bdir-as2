// db link
var mongoose = require('mongoose');

// define the product model (fields and data types)
var EntitySchema = new mongoose.Schema({
    imageUrl: String, 
	Title: String,
    Industry: String,
	City: String,
	Province: String,
    Birth: Number,
	Website: String
});

// make the model public so other files can access it
module.exports = mongoose.model('Entity', EntitySchema);