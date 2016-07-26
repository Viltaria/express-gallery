var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    galleryRouter = require('./routes/galleryRouter');

app.set('view engine', 'jade');
app.set('views', './templates');

app.use('/gallery', galleryRouter);

app.get('/', (req, res) => {
  res.render('gallery/index/index');
});

app.get('*', (req, res) => {
  res.render('gallery/notFound/404');
});


var PORTNUM = 3000;

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});