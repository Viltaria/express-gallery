var express = require('express'),
  Router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize'),
  sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
    host: 'localhost',
    dialect: 'postgres',
  });
var bcrypt = require('bcrypt');
var db = require('./../../../models'),
  User = db.User,
  Gallery = db.Gallery;
var flash = require('connect-flash');

Router.use(flash());

Router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});
Router.get('/register', (req, res) => {
  return res.render('register/register');
});
Router.post('/register', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hash,
          email: req.body.email,
          theme: 'light',
        })
        .then((result) => {
          return res.redirect(`/user/${req.body.username}`);
        })
        .error(() => {
          return res.render('error/error');
        });
    });
  });
});
Router.get('/login', (req, res) => {
  return res.render('login/login', { message: req.flash('error') });
});
Router.get('/me', (req, res) => {
  return res.redirect(`/user/${req.user.username}`);
});
Router.get('/:username', (req, res) => {
  Gallery.findAll({
      where: {
        poster: req.params.username
      }
    })
    .then((data) => {
      var user;
      if(req.user) {
        user = req.user.username;
      }
      if(user === req.params.username) {
        req.params.username = 'Your';
      } else {
        req.params.username = req.params.username + '\'s';
      }
      return res.render('profile/profile', {
        username: req.params.username,
        posts: data
      });
    });
});

module.exports = Router;
