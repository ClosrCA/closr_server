
module.exports = {
    validateEventBody: function(body) {
        if (!body.yelpID) return new Error('Missing field: yelpID');

        if (!body.purpose) return new Error('Missing field: purpose');

        if (!body.startTime) return new Error('Missing field: startTime');

        if (!body.capacity) return new Error('Missing field: capacity');

    }
};