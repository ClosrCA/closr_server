var Promotion = require('../models/Promotion');
var Restaurant = require('../models/Restaurant');
var User = require('../models/User');
var auth = require('../utils/auth');
var csv = require('fast-csv');
var superagent = require('superagent');

var PromotionController = {
    createPromotion: function (req, res) {
        var token = req.headers.authorization;

        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            User.findOne(userID, function (e, user) {
                if (e) return res.status(401).json(e.message);

                if (!user.isAdmin) return res.status(403).json("Admin required");

                var file = req.files.upload[0];
                var promotions = [];

                csv.fromString(file.buffer.toString(), {headers: true})
                    .on('data', function (data) {
                        promotions.push(data);
                    })
                    .on('error', function (err) {
                        return res.status(500).json(err.message);
                    })
                    .on('end', function () {
                        Promotion.create(promotions, function (err, _) {
                            if (err) return res.status(500).json(err.message);

                            return res.status(204).send()
                        })
                    })
            })

        })
    },

    getRestaurantById: function(req, res) {
        var id = req.swagger.params.id.value;
        var token = req.headers.authorization;

        superagent
        .get('https://api.yelp.com/v3/businesses/'+ id)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .end((err, data) => {
            if (err) { return console.log(err); }

            return res.json({restaurant : data.body});
        });
    },
};

module.exports = PromotionController;