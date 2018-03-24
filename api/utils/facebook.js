var request = require('request-promise');

module.exports = {
    verifyUser: verifyUser,
    fetchUserProfile: fetchUserProfile
};

const facebookConsole = {
    debugURL        : "https://graph.facebook.com/debug_token",
    graphURL        : "https://graph.facebook.com/v2.8/me",
    clientID        : "135206970536825",
    clientToken 	: "135206970536825|ed0833e33136af2b7fca0462898d2daa"
};

function verifyUser(token, cb) {
    var options = {
        uri : facebookConsole.debugURL,
        qs  : {
            input_token: token,
            access_token: facebookConsole.clientToken
        },
        json: true
    };

    request(options)
        .then(function(body) {
            console.log(body);
            cb(null, body)
        })
        .catch(function(err) {
            console.log(err);
            cb(err, null)
        })
}

function fetchUserProfile(token, cb) {
    var options = {
        uri : facebookConsole.graphURL,
        qs  : {
            fields: "email,last_name,first_name,gender,birthday,picture.type(large)",
            access_token: token
        },
        json: true
    };

    request(options)
        .then(function(body) {
            console.log(body);
            cb(null, body)
        })
        .catch(function(err) {
            console.log(err);
            cb(err, null)
        })
}