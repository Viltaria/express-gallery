var express = require('express');
var app = express();
var PORTNUM = 3000;
var bodyParser = require('body-parser');

var db = require('./models');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
//root
});
app.get('/gallery:id', (req, res) => {

});
app.get('/gallery/new', (req, res) => {

});

app.post('/gallery', (req, res) => {

});
app.get('/gallery/:id/edit', (req, res) => {

});
app.put('/gallery/:id', (req, res) => {

});
app.delete('/gallery/:id', (req, res) => {

});

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  // db.sequelize.sync();
});