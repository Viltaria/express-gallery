var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres'
    });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', './templates');

var PORTNUM = 3000;

var db = require('./models'),
    Gallery = db.Gallery;

app.get('/', (req, res) => {
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
    console.log(data);
  });
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
  Gallery.create({
    author: req.body.author,
    link: req.body.link, //encodeURL?
    description: req.body.description,
  }).then ( (result) => {
    res.json(result);
  });
});
app.get('/gallery/:id/edit', (req, res) => {

});
app.put('/gallery/:id', (req, res) => {

});
app.delete('/gallery/:id', (req, res) => {

});

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});