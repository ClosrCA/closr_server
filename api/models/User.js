var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    facebookID: String,
    firebaseID: String,
    firstname: String,
    lastname: String,
    birthday: Date,
    gender: String,
    email: String,
    phone: String,
    avatar: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, {
    versionKey: false
});

var User = mongoose.model('User', userSchema);

module.exports = User;