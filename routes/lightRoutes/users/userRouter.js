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
    Gallery = db.Gallery;

Router.get('/register', (req, res) => {

});
Router.get('/login', (req, res) => {

});
Router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));


module.exports = Router;