
module.exports = {
    validateEventBody: function(body) {
        if (!body.yelpID) return new Error('Missing field: yelpID');

        if (!body.purpose) return new Error('Missing field: purpose');

        if (!body.startTime) return new Error('Missing field: startTime');

        if (!body.capacity) return new Error('Missing field: capacity');

        if (!body.lat || !body.lng) return new Error('Missing location info')
    },

    validateCoordination: function(lat, lng) {
        return (lat >= -90 && lat <= 90) && (lng >= -180 && lng <= 180);
    }
};