var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var app = express();

var https = require('https');

app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', engines.hogan);

app.get('/', function(req, res) {
        res.render('form.html');
});

app.post('/register', function(req, res) {
        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                if (success) {
                        res.end("Success!");
                        // TODO: do registration using params in req.body
                } else {
                        res.end("Captcha failed, sorry.");
                        // TODO: take them back to the previous page
                        // and for the love of everyone, restore their inputs
                }
        });
});

app.listen(3000);
console.log("running on port 3000");
//console.log("name":username , "password":password , "email" "email" ) ;


var SECRET = "6Ld4Eg4TAAAAACM-9U5sW7tBbfHJmh-0uou3wEyo";

// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
         https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                callback(parsedData.success);
                        } catch (e) {
                                callback(false);
                        }
                });
        });
}