var Promotion = require('../models/Promotion');
var User = require('../models/User');
var auth = require('../utils/auth');
var csv = require('fast-csv');

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
    }
};

module.exports = PromotionController;