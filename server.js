var bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var express = require('express'),
  app = express();
var config = require('./config/config');
var galleryRouter = require('./routes/routes/gallery/galleryRouter'),
  userRouter = require('./routes/routes/users/userRouter');
var db = require('./models'),
  User = db.User,
  Gallery = db.Gallery;
var Sequelize = require('sequelize'),
  sequelize = new Sequelize('d781khj8mif314', 'vsenyxpxhxabxq', 'TUCXS9rSbX3PSpY8p-tpXiHs7j', {
    host: 'ec2-54-243-199-79.compute-1.amazonaws.com',
    port: '5432',
    dialect: 'postgres',
  });
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.set('view engine', 'jade');

var lightOrDark;
if(lightOrDark === undefined) {
  lightOrDark = 'light'; //light theme by default
  app.set('views', `./templates/${lightOrDark}Gallery`);
}
app.get('/light', (req, res) => {
  lightOrDark = 'light';
  app.set('views', `./templates/${lightOrDark}Gallery`);
  res.redirect('/');
});
app.get('/dark', (req, res) => {
  lightOrDark = 'dark';
  app.set('views', `./templates/${lightOrDark}Gallery`);
  res.redirect('/');
});

app.use(bodyParser.urlencoded({ extended: true }));
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
  secret: config.SECRET,
  resave:true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({
      where: { username: username },
    })
    .then((result) => {
      var p = false;
      if (result) {
        p = result.dataValues.password;
      }
      bcrypt.compare(password, p, (err, res) => {
        if (res) {
          return done(null, result.dataValues);
        } else {
          return done(null, false, { message: 'Failed login, please try again.' }); // on failed login
        }
      });
    })
    .error(() => {
      return done(null, false);
    });
}));

passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});

app.use('/gallery', galleryRouter);
app.use('/user', userRouter);

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true,
}));

app.get('/', (req, res) => {
  Gallery.findAll({
      limit: 20,
      order: 'ID DESC'
    })
    .then((data) => {
      var user = false;
      if (req.user) {
        user = req.user.username;
      }
      return res.render('index/index', {
        gallery: data,
        user: user,
      });
    })
    .error(() => {
      return res.render('error/error');
    });
});

app.get('*', (req, res) => {
  res.render('notFound/404');
});

var PORTNUM = 5432;

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});
