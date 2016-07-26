var express = require('express'),
    Router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    });

var db = require('./../../../models'),
    User = db.User;
var config = require('./../../../config/config');


Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
Router.get('/register', (req, res) => {
  return res.render('register/register');
});
Router.post('/register', (req, res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  }).then ( (result) => {
    sequelize.query('SELECT * FROM "Galleries" ORDER BY ID DESC LIMIT 20', {type: sequelize.QueryTypes.SELECT})
    .then( (data) => {
      return res.render('index/index',//render user page?
      {
        gallery:data,
      });
    }).error( () => {
      return res.render('error/error');
    });
  }).error ( () => {
    return res.render('error/error');
  });
});
Router.get('/login', (req, res) => {
  return res.render('login/login');
});
// Router.post('/login', (req, res) => {
//    passport.authenticate('local', {
//     successRedirect: '/gallery',
//     failureRedirect: '/login',
//   });
// });
// Router.get('/test', isAuth, (req, res) => {
//   res.render('error/error');
// });

module.exports = Router;