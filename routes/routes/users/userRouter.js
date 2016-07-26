var express = require('express'),
    Router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    });

var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var db = require('./../../../models'),
    User = db.User;
var config = require('./../../../config/config');

Router.use(bodyParser.urlencoded({extended:true}));
Router.use(bodyParser.json());
Router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

Router.use(session({
  secret:config.SECRET,
  saveUninitialized:true,
}));
Router.use(passport.initialize());
Router.use(passport.session());
passport.use(new LocalStrategy((username, password, done) => {
  db.query(`SELECT * FROM "Users" WHERE username=${username}`)
  .then( (result) => {
    if(result[0].password === password) {
      return done(null, user);
    } else {
      res.render('error/error');
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
var isAuth = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/user/register');
  }
  return next();
};

Router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login',
}));
Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
Router.get('/register', (req, res) => {
  return res.render('register/register');
});
Router.post('/signup', (req, res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  }).then ( (result) => {
    return res.render('index/index');
  }).error ( () => {
    return res.render('error/error');
  });
});
// Router.get('/login', (req, res) => {

// });


module.exports = Router;