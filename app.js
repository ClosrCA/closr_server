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

  console.log('App started on port: ', port);

  mongoose.connection.openUri(env.local.db, function (err) {
      if (err) return console.log(err);

      console.log('********** db connected **********')
  });

  console.log(swaggerExpress.runner.swagger.paths);

});
