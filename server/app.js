/**
 * Created by lukedowell on 9/10/15.
 */
var express = require('express');
var app = express();

var config = require('./config');
var routes = require('./routes/routes');

var Profile = require('./models/Profile');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Setup mongoose
mongoose.connect('mongodb://localhost/oath_test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mongo!");
});

//Setup passport strategy
passport.use(new GoogleStrategy({
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: config.CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        //findOrCreate
        Profile.findOne({
            googleID: profile.id
        }, function(err, entry) {
            if(err) {
                return done(err);
            }

            if(!entry) {
                entry = new Profile({
                    googleID: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    auth: {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                });
                entry.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Saved entry: " , entry);
                    return done(err, entry);
                });
            } else {
                return done(err, entry);
            }
        });
    }
));

passport.serializeUser(function(user, callback) {
    callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
    console.log("Deserialize: \n" + id + "\n -------------");
    Profile.findById(id, function(err, user) {
        callback(err, user);
    });
});

//Setup express app
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'bop bib bobbity boop boop beep',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Initialize routes
routes.init(app);

//Start server
app.listen(app.get('port'), function() {
    console.log("Listening on port: " + app.get('port'));
});