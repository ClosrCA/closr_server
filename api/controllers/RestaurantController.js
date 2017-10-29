var Restaurant = require('../models/Restaurant');
var User = require('../models/User');
var auth = require('../utils/auth');
var validator = require('../utils/validator');

var RestaurantController = {
    createRestaurant: function (req, res) {
        var token = req.headers.authorization;

        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            User.findOne(userID, function (e, user) {
                if (e) return res.status(401).json(e.message);

                if (!user.isAdmin) return res.status(401).json("Admin required");


            })
        })
    }
};

module.exports = RestaurantController;