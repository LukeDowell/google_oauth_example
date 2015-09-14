/**
 * Created by lukedowell on 9/14/15.
 */
var index = require('./index');
var auth = require('./auth');

module.exports = {
    init: function(app) {
        app.use('/auth', auth);
        console.log("Auth initialized");
        app.use('/', index);
        console.log("Index initialized");
    }
};