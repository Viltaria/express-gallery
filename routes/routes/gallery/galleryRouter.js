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
  Gallery.findById(req.params.id)
  .then( (data) => {
    if(!data) {
      return res.render('notFound/404');
    }
    var arr = [data.dataValues];
    Gallery.findAll({
      limit: 3,
      order: 'RANDOM()'
    })
    .then ( (chunk) => {
      var array = [chunk[0].dataValues, chunk[1].dataValues, chunk[2].dataValues]; //change this make it fluid
      var user = false;
      if(req.user) {
        user = req.user.username;
      }
      return res.render('index/index', {
        gallery:arr,
        pictures:array,
        user: user,
      });
    })
    .error ( () => {
      return res.render('error/error');
    });
  })
  .error ( () => {
    return res.render('error/error');
  });
});
Router.post('/', isAuth, verification, (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
    poster: req.user.username,
  })
  .then ( (result) => {
    Gallery.findById(result.dataValues.id)
    .then( (data) => {
      var arr = [data];
      Gallery.findAll({
      limit: 3,
      order: 'RANDOM()'
    })
      .then ( (result) => {
        var array = [result[0].dataValues, result[1].dataValues, result[2].dataValues]; //make this fluid
        var user = false;
        if(req.user) {
          user = req.user.username;
        }
        return res.render('index/index', {
          gallery:arr,
          pictures:array,
          user: user,
        });
      })
      .error( () => {
        return res.render('error/error');
      });
    });
  })
  .error ( () => {
    return res.render('error/error');
  });
});
Router.get('/:id/edit', isAuth, verification, (req, res) => {
  Gallery.findById(req.params.id)
  .then( (data) => {
    var arr = [data];
    return res.render('edit/edit', {
      gallery:arr,
      id:req.params.id,
    });
  })
  .error( () => {
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
      where: {
        id: req.params.id
      }
    }
  ).then( () => {
    Gallery.findById(req.params.id)
    .then( (data) => {
      var arr  = [data];
      Gallery.findAll({
      limit: 3,
      order: 'RANDOM()'
      })
      .then ( (result) => {
        var array = [result[0].dataValues, result[1].dataValues, result[2].dataValues]; //make this fluid
        if(req.user) {
          user = req.user.username;
        } else {
          user = false;
        }
        return res.render('index/index', {
          gallery:arr,
          pictures:array,
          user: user,
        });
      })
      .error ( () => {
        return res.render('error/error');
      });
    });
  })
  .error( () => {
    return res.render('error/error');
  });
});
Router.delete('/:id', isAuth, verification, (req, res) => {
  Gallery.destroy({
    where: {
      id: req.params.id,
    }
  })
  .then( (data) => {
    if(data.rowCount === 0) {
      return res.render('error/error');
    }
  });
  Gallery.findAll({
    limit: 20,
    order: 'ID DESC',
  })
  .then ( (data) => {
    return res.render('index/index',{
      gallery:data,
    });
  })
  .error( () => {
    return res.render('error/error');
  });
});
Router.get('/', (req, res) => {
  Gallery.findAll({
    limit: 20,
    order: 'ID DESC'
  })
  .then ( (data) => {
    var user = false;
    if(req.user) {
      user = req.user.username;
    }
    return res.render('index/index',{
      gallery:data,
      user: user,
    });
  })
  .error ( () => {
    return res.render('error/error');
  });
});
Router.get('*', (req, res) => {
  return res.render('notFound/404');
});

module.exports = Router;