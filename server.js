var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var express = require('express'),
    app = express();
var config = require('./config/config');
// light|| dark
var galleryRouter = require('./routes/routes/gallery/galleryRouter'),
    userRouter = require('./routes/routes/users/userRouter');
var db = require('./models'),
    User = db.User,
    Gallery = db.Gallery;
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    });
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

app.set('view engine', 'jade');
app.set('views', './templates/lightGallery');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(session({
  secret:config.SECRET,
  saveUninitialized:true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({
    where: {username : username},
  })
  .then( (result) => {
    if(password === result.dataValues.password || null) {
      return done(null, result.dataValues);
    } else {
      return done(null, false); // on failed login
    }
  }).error ( () => {
    return done(null, false);
  });
}));

passport.serializeUser((user,done) => {
  return done(null, user);
});
passport.deserializeUser((user,done) => {
  return done(null, user);
});

app.use('/gallery', galleryRouter);
app.use('/user', userRouter);

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/user/login',
}));

app.get('/', (req, res) => {
  Gallery.findAll({
    limit: 20,
    order: 'ID DESC'
  })
  .then ( (data) => {
    return res.render('index/index',{
      gallery:data,
    });
  })
  .error ( () => {
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