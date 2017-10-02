"use strict";

var jwt = require("jsonwebtoken");

const sharedSecret = '!@#yourTableSharedSecret_ohyeah';
const issuer = 'YourTable';

module.exports = {
    verifyToken: verifyToken,
    issueToken: issueToken
};

function verifyToken(token, callback) {

    function sendError() {
        return req.res.status(403).json({ message: "Error: Access Denied" });
    }

    if (token && token.indexOf("Bearer ") === 0) {
        var tokenString = token.split(" ")[1];

        jwt.verify(tokenString, sharedSecret, function(verificationError, decodedToken) {

            if (verificationError === null && decodedToken) {
                var issuerMatch = decodedToken.iss === issuer;

                if (issuerMatch) {

                    return callback(null, decodedToken.sub)
                } else {
                    return callback(sendError(), null)
                }
            } else {
                return callback(sendError(), null)
            }
        });
    } else {
        return callback(sendError(), null)
    }
}

function issueToken(userID) {
    return jwt.sign(
        {
            sub: userID,
            iss: issuer
        },

        sharedSecret
    )
}