'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');

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

  mongoose.connect('mongodb://localhost/closr').connection.on('error', function (err) {
      console.log(err)
  });

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }

});
