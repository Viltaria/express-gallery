var express = require('express'),
    Router = express.Router();
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    });
var verification = require('./verification');
var db = require('./../../../models'),
    Gallery = db.Gallery,
    User = db.User;

var config = require('./../../../config/config');

var isAuth = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect('/user/register');
  }
  return next();
};

Router.get('/new', isAuth, verification, (req, res) => {
  return res.render('new/new');
});
Router.get('/:id', verification, (req, res) => {
  if(isNaN(Number(req.params.id))) {
    return res.render('notFound/404');
  }
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
    if(data.length === 0) {
      return res.render('notFound/404');
    }
    sequelize.query(`SELECT * FROM "Galleries" ORDER BY RANDOM() LIMIT 3`, {type: sequelize.QueryTypes.SELECT})
    .then ( (chunk) => {
      return res.render('index/index',{
        gallery:data,
        pictures:chunk,
      });
    }).error ( () => {
      return res.render('error/error');
    });
  }).error ( () => {
    return res.render('error/error');
  });
});
Router.post('/', isAuth, verification, (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
  }).then ( (result) => {
    sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${result.dataValues.id}`, {type: sequelize.QueryTypes.SELECT})
    .then( (data) => {
      return res.render('index/index', {
        gallery:data,
      });
    });
  }).error ( () => {
    return res.render('error/error');
  });
});
Router.get('/:id/edit', verification, (req, res) => {
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
    res.render('edit/edit', {
      gallery:data,
      id:req.params.id,
    });
  }).error( () => {
    return res.render('error/error');
  });
});
Router.put('/:id', isAuth, verification, (req, res) => {
  Gallery.update(
    {
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    },
    {
      fields: ['author','link','description'],
      where: {id: req.params.id}
    }
  ).then( () => {
    sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
    .then( (data) => {
      res.render('index/index',{
        gallery:data,
      });
    });
  }).error( () => {
    return res.render('error/error');
  });
});
Router.delete('/:id', isAuth, verification, (req, res) => {
  sequelize.query(`DELETE FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.DELETE})
  .then( (data) => {
    if(data.rowCount === 0) {
      return res.render('error/error');
    }
  });
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('index/index',{
      gallery:data,
    });
  }).error( () => {
    return res.render('error/error');
  });
});
Router.get('*', (req, res) => {
  res.render('notFound/404');
});

module.exports = Router;