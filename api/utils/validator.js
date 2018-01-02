
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
    },

    validateOpenHour: function(event, restaurant) {
        var isValid = false;
        var startTime = new Date(event.startTime);
        var day = startTime.getDay();
        var time = "" + startTime.getHours() + startTime.getMinutes();

        restaurant.hours.forEach(function(element) {
            element.open.forEach(function(entry){
                if(day == entry.day){
                    isValid = (time > entry.start && time < entry.end);
                }
            })
        });

        return isValid;
    }
};