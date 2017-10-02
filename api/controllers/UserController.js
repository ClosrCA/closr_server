var User = require('../models/User');
var fb = require('../utils/facebook');
var auth = require('../utils/auth');

var UserController = {

    facebookLogin: function(req, res) {
        var fbToken = req.body.access_token;

        fb.verifyUser(fbToken, function (err, profile) {
            if (err) return res.status(400).json({message: err.message});

            if (!profile.data.is_valid) return res.status(400).json({message: "invalid facebook token"});

            var fbID = profile.data.user_id;

            User.findOne({facebookID: fbID}, function (err, user) {
                if (err) return res.status(500).json(err);

                if (user) {
                    var message = {
                        profile: user,
                        isNewUser: false,
                        token: auth.issueToken(user.id)
                    };

                    res.json({message: true})
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
                                profile: userObject._doc,
                                isNewUser: true,
                                token: auth.issueToken(userObject.id)
                            })
                        })
                    })
                }
            })
        })
    }
};

module.exports = UserController;

