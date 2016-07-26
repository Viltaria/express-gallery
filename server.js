var bodyParser = require('body-parser');
var express = require('express'),
    app = express();
var galleryRouter = require('./routes/lightRoutes/galleryRouter'),
    userRouter = require('./routes/lightRoutes/userRouter');
var db = require('./models');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    });

app.set('view engine', 'jade');
app.set('views', './templates/lightGallery');

app.use('/gallery', galleryRouter);
// app.use('/user', userRouter);


app.get('/', (req, res) => {
  sequelize.query('SELECT * FROM "Galleries" ORDER BY id DESC LIMIT 20', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    return res.render('index/index',{
      gallery:data,
    });
  }).error ( () => {
    return res.render('error/error');
  });
});

app.get('*', (req, res) => {
  res.render('notFound/404');
});

var PORTNUM = 3000;

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});