var bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('sequelizedb', 'sequelizeowner', '123', {
      host: 'localhost',
      dialect: 'postgres'
    });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.set('view engine', 'jade');
app.set('views', './templates');

function verification (req, res, next) {
  var body = req.body;
  var supportedFileTypes = ['.tif','.jpg','.png','.jpeg'],
      fileType;
  if(req.method === 'POST') {
      fileType = body.link.slice(body.link.lastIndexOf('.'), body.link.length);
    if(!body.author || !body.link || !body.description) {
      //return render error page
    } else if(supportedFileTypes.indexOf(fileType) < 0) {
      // return render error page
    }
  } else if (req.method === 'PUT') {
      fileType = body.link.slice(body.link.lastIndexOf('.'), body.link.length);
      if(supportedFileTypes.indexOf(fileType) < 0) {
        //return render error page
      }
      for(var key in body) {
        if(!body[key]) {
          //return render error page
        }
      }
  }
  next();
}

var PORTNUM = 3000;

var db = require('./models'),
    Gallery = db.Gallery;

var rootPaths = ['/', '/gallery', '/galler', '/galle', '/gall', '/gal', '/ga', '/g'];
app.get(rootPaths, verification, (req, res) => {
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  }).error ( () => {
    //res.render error page
  });
});
app.get('/gallery/new', verification, (req, res) => {
  res.render('gallery/new');
});
app.get('/gallery/:id', verification, (req, res) => {
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  }).error ( () => {
    //res render error page
  });
});
app.post('/gallery', verification, (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link, //encodeURL?
    description: req.body.description,
  }).then ( (result) => {
    res.json(result);
  }).error ( () => {
    //res render error page
  });
});
app.get('/gallery/:id/edit', verification, (req, res) => {
  sequelize.query(`SELECT * FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.SELECT})
  .then( (data) => {
    res.render('gallery/edit', {
      gallery:data,
      id:req.params.id,
    });
  }).error( () => {
    //res render error page
  });
});
app.put('/gallery/:id', verification, (req, res) => {
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
      res.render('gallery/index',{
        gallery:data,
      });
    });
  }).error( () => {
    //res.render Error page
  });
});
app.delete('/gallery/:id', verification, (req, res) => {
  sequelize.query(`DELETE FROM "Galleries" WHERE id = ${req.params.id}`, {type: sequelize.QueryTypes.DELETE})
  .then( (data) => {
    if(data.rowCount === 0) {
      //return render error page
    }
  });
  sequelize.query('SELECT * FROM "Galleries"', {type: sequelize.QueryTypes.SELECT})
  .then ( (data) => {
    res.render('gallery/index',{
      gallery:data,
    });
  }).error( () => {
    //res.render Error page
  });
});
app.get('*', verification, (req, res) => {
  //res.render 404 page
});

app.listen(PORTNUM, function() {
  console.log('Now listening in on port ' + PORTNUM);
  db.sequelize.sync();
});