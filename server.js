var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    galleryRouter = require('./routes/galleryRouter');

app.set('view engine', 'jade');
app.set('views', './templates');

app.use('/gallery', galleryRouter);


var PORTNUM = 3000;

var db = require('./models'),
    Gallery = db.Gallery;

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});