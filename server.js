var bodyParser = require('body-parser'),
    express = require('express'),
    app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var PORTNUM = 3000;

var db = require('./models'),
    Gallery = db.Gallery;

app.get('/', (req, res) => {

});
app.get('/gallery/:id', (req, res) => {

});
app.get('/gallery/new', (req, res) => {

});
app.post('/gallery', (req, res) => {
  // User.create({
  //   username: req.body.username
  // }).then( (user) => {
  //   res.json(user);
  // });
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