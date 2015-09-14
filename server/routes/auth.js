/**
 * Created by lukedowell on 9/11/15.
 */
var router = require('express').Router();
var passport = require('passport');

router.get('/google',
    passport.authenticate('google',
        {
            scope: ['https://www.googleapis.com/auth/plus.me',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'],
            accessType: 'offline'
        }
    )
);

router.get('/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/fail'
    }),
    function(req, res) {
        res.redirect('/auth/success');
    }
);

router.get('/success', function(req, res) {
    console.log(req.user);
    res.send("Success!");
});

router.get('/fail', function(req, res) {
    console.log("Failed");
    res.send('Failed!');
});
module.exports = router;