'use strict';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const express = require('express');

const config = require('./config/config');
// const config = {SECRET: 'placeholder'};

const galleryRouter = require('./routes/routes/gallery/galleryRouter');
const userRouter = require('./routes/routes/users/userRouter');
const db = require('./models');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const app = express();
const User = db.User;

app.set('view engine', 'jade');

let lightOrDark;
if (!lightOrDark) {
  lightOrDark = 'light';
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
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
  return null;
}));
app.use(session({
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({
    where: { username },
  })
  .then((result) => {
    let p = false;
    if (result) {
      p = result.dataValues.password;
    }
    bcrypt.compare(password, p, (err, res) => {
      if (res) {
        return done(null, result.dataValues);
      }
      return done(null, false, { message: 'Failed login, please try again.' }); // on failed login
    });
  })
  .error(() => done(null, false));
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use('/gallery', galleryRouter);
app.use('/user', userRouter);

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true,
}));

app.get('/', (req, res) => res.redirect('/gallery'));

app.get('*', (req, res) => res.render('notFound/404'));

const PORTNUM = process.env.PORT || 3000;

app.listen(PORTNUM, () => {
  db.sequelize.sync();
});
