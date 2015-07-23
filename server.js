var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var json2csv = require('json2csv');
var parse = require('csv-parse');
var auth = require('http-auth');

var basic = auth.basic({
  realm: 'Admin Area'
}, function(username, password, callback) {
  callback(username === "admin" && password === "admin");
});

const DB_FILE = 'db.txt';
const MAPQUEST_API_KEY = 'CKCs7hL85YoTEiVdilrGfnjxifEqEaMU';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('register');
});

app.post('/adjust', function(req, res) {
  var data = req.body;

  var baseURL = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + MAPQUEST_API_KEY + '&location=';
  var requestURL = baseURL + encodeURIComponent(data.address);

  request({
    'url': requestURL
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var places = JSON.parse(response.body);

      if (places.results[0].locations.length > 0) {
        data.lat = places.results[0].locations[0].displayLatLng.lat;
        data.lng = places.results[0].locations[0].displayLatLng.lng;

        var payload = {
          'json_data': JSON.stringify(data),
          'data': data
        };

        res.render('adjust', payload);
      }
    };
  });
});

app.post('/register', function(req, res) {
  var data = req.body;

  json2csv({
    data: data,
    hasCSVColumnTitle: false
  }, function(err, csv) {
    if (err) console.log(err);
    fs.appendFile(DB_FILE, csv + '\n', function(err) {
      if (err) throw err;
      res.render('success');
    });
  });
});

app.get('/admin', auth.connect(basic), function(req, res) {
  var parser = parse({
    delimiter: ','
  }, function(err, data) {
    var payload = {
      'json_data': JSON.stringify(data)
    };

    res.render('admin', payload);
  });

  fs.createReadStream(path.join(__dirname, DB_FILE)).pipe(parser);
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
