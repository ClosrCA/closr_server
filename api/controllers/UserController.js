var User = require('../models/User');
var fb = require('../utils/facebook');
var auth = require('../utils/auth');

var UserController = {

    facebookLogin: function(req, res) {
        var fbToken = req.body.access_token;

        fb.verifyUser(fbToken, function (err, profile) {
            if (err) return res.status(400).json({message: err.message});

            if (!profile.data.is_valid) return res.status(400).json(profile.data.error.message);

            var fbID = profile.data.user_id;

            User.findOne({facebookID: fbID}, function (err, user) {
                if (err) return res.status(500).json({message: err.message});

                if (user) {
                    var message = {
                        profile: user,
                        isNewUser: false,
                        token: auth.issueToken(user.id)
                    };

                    res.json({message: message})
                } else {
                    fb.fetchUserProfile(fbToken, function (err, profile) {
                        if (err) return res.status(400).json({message: err.message});

                        User.create({
                            facebookID: profile.id,
                            firstname: profile.first_name,
                            lastname: profile.last_name,
                            gender: profile.gender,
                            email: profile.email,
                            birthday: profile.birthday,
                            avatar: profile.picture.data.url
                        }, function (err, userObject) {
                            if (err) return res.status(500).json(err);

                            res.json({
                                profile: userObject,
                                isNewUser: true,
                                token: auth.issueToken(userObject.id)
                            })
                        })
                    })
                }
            })
        })
    },

    getMyProfile: function (req, res) {
        var token = req.headers.authorization;
        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            User.findOne(userID, function (e, user) {
                if (e) return res.status(500).json({message: e.message});

                res.json(user);
            })
        })
    }
};

module.exports = UserController;

