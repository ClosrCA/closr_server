var User = require('../models/User');
var fb = require('../utils/facebook');
var auth = require('../utils/auth');
var fileUpload = require('../utils/fileUpload');
var _ = require('lodash');

var UserController = {

    facebookLogin: function(req, res) {
        var fbToken = req.body.access_token;

        fb.verifyUser(fbToken, function (err, profile) {
            if (err) return res.status(400).json(err.message);

            if (!profile.data.is_valid) return res.status(400).json(profile.data.error.message);

            var fbID = profile.data.user_id;

            User.findOne({facebookID: fbID}, function (err, user) {
                if (err) return res.status(500).json(err.message);

                if (user) {
                    var message = {
                        profile: user,
                        isNewUser: false,
                        token: auth.issueToken(user.id)
                    };

                    res.json({message: message})
                } else {
                    fb.fetchUserProfile(fbToken, function (err, profile) {
                        if (err) return res.status(400).json(err.message);

                        User.create({
                            facebookID: profile.id,
                            firstname: profile.first_name,
                            lastname: profile.last_name,
                            displayName: profile.first_name,
                            gender: profile.gender,
                            email: profile.email,
                            birthday: profile.birthday,
                            avatar: profile.picture.data.url
                        }, function (err, userObject) {
                            if (err) return res.status(500).json(err.message);

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

            User.findById(userID, function (e, user) {
                if (e) return res.status(500).json(e.message);

                res.json({profile: user});
            })
        })
    },

    updateProfile: function (req, res) {
        var token = req.headers.authorization;
        var displayName = req.body.displayName;
        var email = req.body.email;
        var phone = req.body.phone;
        var avatar = req.body.avatar;

        // TODO: data validation
        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            var update = {};
            if (displayName) {
                update.displayName = displayName;
            }

            if (email) {
                update.email = email;
            }

            if (phone) {
                update.phone = phone;
            }

            if (avatar) {
                update.avatar = avatar;
            }

            if (_.isEmpty(update)) {
                return res.status(204).send();
            }

            User.findByIdAndUpdate(userID, update, function (e, user) {
                if (e) return res.status(500).json(e.message);

                return res.status(204).send();
            })
        })
    },

    uploadAvatar: function (req, res) {
        var token = req.headers.authorization;
        var file = req.files.upload[0];
        var fileName = req.swagger.params.fileName.value;

        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            fileUpload.uploadImageToAWS(file, fileName, function(err, data){
                if (err) return res.status(500).json(err);
                
                User.findByIdAndUpdate(userID, {avatar : data.Location}, function (e, user) {
                    if (e) return res.status(500).json(e.message);
    
                    return res.status(204).send();
                })
            });
        })
    }
};

module.exports = UserController;

