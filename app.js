'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');
var env = require('./config/env');

module.exports = app; // for testing

var config = {
    appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 10010;
    app.listen(port);

    mongoose.connect(env.local.db, {useMongoClient: true});

    mongoose.connection.on('connected', function() {
        console.log('database connected!');
    })
    mongoose.connection.on('error', function(err) {
        console.log('db connection error: ', err);
    })
    mongoose.connection.on('disconnected', function() {
        console.log('database disconnected');
    });

    console.log('App started on port: ', port);
});
