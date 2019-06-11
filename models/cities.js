var mongoose = require('mongoose');

module.exports = mongoose.model('City', {
    city: String,
    date: String,
    minTemp: Number,
    maxTemp: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    windDirection: String,
    weatherType: String
});