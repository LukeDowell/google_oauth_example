/**
 * Created by lukedowell on 9/10/15.
 */
var app = require('express')();
var index = require('./routes/index');
var fs = require('fs');

function loadClientSecrets() {
    fs.readFile(__dirname + "/client_secret.json", function(err, content) {
        if(err) {
            console.log("Error reading file");
        }
        var cred = JSON.parse(content);
        global.CLIENT_ID = cred.web.client_id;
        global.CLIENT_SECRET = cred.web.client_secret;

    });
}
loadClientSecrets();

app.set('port', (process.env.PORT || 5000));
app.use('/', index);

app.listen(app.get('port'), function() {
    console.log("Listening on port: " + app.get('port'));
});