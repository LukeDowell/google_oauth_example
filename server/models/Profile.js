/**
 * Created by lukedowell on 9/14/15.
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    googleID: 'string',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    image: 'string',
    auth: {
        accessToken: 'string',
        refreshToken: 'string'
    }
});

module.exports = mongoose.model('Profile', schema);