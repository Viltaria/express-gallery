var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    galleryRouter = require('./routes/galleryRouter');

app.set('view engine', 'jade');
app.set('views', './templates');

var galleryPaths = ['/', '/gallery'];
app.use(galleryPaths, galleryRouter);


var PORTNUM = 3000;

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});