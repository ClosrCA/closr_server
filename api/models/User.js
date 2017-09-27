var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, {
    versionKey: false
});

var User = mongoose.model('User', userSchema);

module.exports = User;