var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	api: String,
	source: String,
	title: String,
	upvotes: Number
});

module.exports = mongoose.model('Post', postSchema);

