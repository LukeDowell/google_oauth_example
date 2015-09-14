/**
 * Created by lukedowell on 9/11/15.
 */
var router = require('express').Router();

router.post('/', function(req, res) {
    console.log(req.body);
    res.send("Roger");
});

module.exports = router;