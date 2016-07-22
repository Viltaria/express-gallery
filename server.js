var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres'
    });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.set('view engine', 'jade');
app.set('views', './templates');

var PORTNUM = 3000;

var db = require('./models'),
    Gallery = db.Gallery;

var rootPaths = ['/', '/gallery', '/galler', '/galle', '/gall', '/gal', '/ga', '/g'];
app.get(rootPaths, (req, res) => {
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  });
});
app.get('/gallery/new', (req, res) => {
  res.render('gallery/new');
});
app.get('/gallery/:id', (req, res) => {
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  });
});
app.post('/gallery', (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link, //encodeURL?
    description: req.body.description,
  }).then ( (result) => {
    res.json(result);
  });
});
app.get('/gallery/:id/edit', (req, res) => {
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
  res.render('gallery/edit', {
    gallery:data,
    id:req.params.id,
  });
  });
});
app.put('/gallery/:id', (req, res) => {

});
app.delete('/gallery/:id', (req, res) => {
  sequelize.query(`DELETE FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.DELETE});
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  });
});

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});