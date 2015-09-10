/**
 * Created by lukedowell on 9/10/15.
 */
var router = require('express').Router();
var google = require('googleapis');
var fs = require('fs');

var SCOPES = 'https://www.googleapis.com/auth/calendar';

var OAuth2 = google.auth.OAuth2;
var oauthClient;

var authed = false;


router.get('/auth', function(req, res) {
    var code = req.query.code;
    oauthClient.getToken(code, function(err, tokens) {
        if(!err) {
            oauthClient.setCredentials(tokens);
            authed = true;
        }
    });
    res.redirect('/');
});

router.get('/*', function(req, res) {
    if(!authed) {
        oauthClient = new OAuth2(global.CLIENT_ID, global.CLIENT_SECRET, 'http://localhost:5000/auth');
        var url = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        res.redirect(url);
    } else {
        var calendar = google.calendar('v3');
        calendar.events.list({
            auth: oauthClient,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var events = response.items;
            if (events.length == 0) {
                console.log('No upcoming events found.');
            } else {
                var responseEvents = [];
                responseEvents.push('Upcoming 10 events:');
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    var start = event.start.dateTime || event.start.date;
                    responseEvents.push('%s - %s', start, event.summary);
                }
                res.send(responseEvents);
            }
        });
    }
});

module.exports = router;
