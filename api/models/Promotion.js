var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    yelpID: String,
    name: String,
    cuisine: String,
    contact: String,
    email: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    street: String,
    promotionType: String,  // featured, discount, deal
    startDate: Date,
    endDate: Date,
    startHour: String,
    endHour: String,
    price: String,
    amount: Number,
    item: String,
    images: [String],
    location: { lng: Number, lat: Number },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
}, {
    versionKey: false
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;