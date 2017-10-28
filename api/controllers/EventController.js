var Event = require('../models/Event');
var User = require('../models/User');
var auth = require('../utils/auth');
var validator = require('../utils/validator');

var EventController = {

    create: function (req, res) {
        var token = req.headers.authorization;
        var event = req.body;

        auth.verifyToken(token, function (err, userID) {
            if (err) return res.status(401).json(err.message);

            var validation = validator.validateEventBody(event);
            if (validation) return res.status(400).json(validation.message);

            User.findById(userID, function (err, user) {
                if (err) return res.status(500).json(err.message);
                
                event.author = user._id;
                
                Event.create(event, function (err, _) {
                    if (err) return res.status(500).json(err.message);

                    res.status(204).send()
                })
            })
        })
    },
    
    update: function (req, res) {
        
    },
    
    delete: function (req, res) {
        
    },

    getOne: function(req, res) {
        var id = req.swagger.params.id.value;
        Event.findById(id, function (e, event) {
            if (e) return res.status(500).json(e.message);

            res.json({event: event});
        })     
    },

    getEvents: function(req, res) {
        var page = req.swagger.params.page.value;
        var pageSize = req.swagger.params.pageSize.value;

        Event.find({ 'hasFinished': false }, function (e, events){
            if (e) return res.status(500).json(e.message);

            res.json({events: events});
        })
        .skip((page-1)*pageSize)
        .limit(pageSize)
    }
};

module.exports = EventController;