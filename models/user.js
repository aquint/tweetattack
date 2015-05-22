var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    shop: {type:String, unique:true},
    access_token: String,
    access_token_secret: String
});

module.exports = mongoose.model('User', UserSchema);