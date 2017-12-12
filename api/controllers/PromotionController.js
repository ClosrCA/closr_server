var Restaurant = require('../models/Restaurant');
var User = require('../models/User');
var auth = require('../utils/auth');
var async = require("async");
var fs = require('fs');
var $ = require('jquery-csv');

var RestaurantController = {
    createRestaurant: function (req, res) {
        // var token = req.headers.authorization;

        // auth.verifyToken(token, function (err, userID) {
        //     if (err) return res.status(401).json(err.message);
        //
        //     User.findOne(userID, function (e, user) {
        //         if (e) return res.status(401).json(e.message);
        //
        //         if (!user.isAdmin) return res.status(403).json("Admin required");

                var file = req.files.upload[0];
                fs.readFile(file.patch, function (err, data) {
                    if (err) return res. status(500).json(err.message);

                    var restaurants = $.csv.toObjects(data);
                    Restaurant.create()
                })

            // })
        // })
    }
};

module.exports = RestaurantController;