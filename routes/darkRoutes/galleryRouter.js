var express = require('express'),
    Router = express.Router(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres',
    }),
    verification = require('./verification'),
    db = require('./../../models'),
    Gallery = db.Gallery;

Router.use(bodyParser.urlencoded({extended:true}));
Router.use(bodyParser.json());
Router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

var rootPaths = ['/', '/page'];
Router.get(rootPaths, verification, (req, res) => {
  sequelize.query('SELECT * FROM "Galleries" ORDER BY id DESC LIMIT 20', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    return res.render('index/index',{
      gallery:data,
    });
  }).error ( () => {
    return res.render('error/error');
  });
});

Router.get('/page/:num', verification, (req, res) => {
  var offset;
  if(Number(req.params.num) !== 1) {
    offset = (Number(req.params.num) * 20) - 20;
  } else {
    offset = 0;
  }
  if(isNaN(offset)) {
    return res.render('error/error');
  } else if (offset < 0) {
    offset = 0;
  }
  sequelize.query(`SELECT * FROM "Galleries" ORDER BY id DESC LIMIT 20 OFFSET ${offset}`, {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    if(data.length === 0) {
      return res.render('notFound/404');
    }
    return res.render('index/index', {
      gallery:data,
    });
  }).error ( () => {
    return res.render('error/error');
  });
});
Router.get('/new', verification, (req, res) => {
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
    return res.render('index/index',{
      gallery:data,
    });
  }).error ( () => {
    return res.render('error/error');
  });
});
Router.post('/', verification, (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link, //encodeURL?
    description: req.body.description,
  }).then ( (result) => {
    console.log(result.dataValues.id);
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
Router.put('/:id', verification, (req, res) => {
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
Router.delete('/:id', verification, (req, res) => {
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
Router.get('*', verification, (req, res) => {
  res.render('notFound/404');
});

module.exports = Router;