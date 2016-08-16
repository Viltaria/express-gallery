'use strict';
const express = require('express');

const router = express.Router();

const verification = require('./verification');
const db = require('./../../../models');

const Gallery = db.Gallery;

const isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/user/register');
  }
  return next();
};


router.get('/new', isAuth, verification, (req, res) => res.render('new/new'));
router.get('/:id', verification, (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.render('notFound/404');
  }
  Gallery.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.render('notFound/404');
      }
      const arr = [data.dataValues];
      Gallery.findAll({
        limit: 3,
        order: 'RANDOM()',
      })
        .then((chunk) => {
          const array = [chunk[0].dataValues, chunk[1].dataValues, chunk[2].dataValues];
          let user = false;
          if (req.user) {
            user = req.user.username;
          }
          return res.render('index/index', {
            gallery: arr,
            pictures: array,
            user,
          });
        })
        .error(() => res.render('error/error'));
      return false;
    })
    .error(() => res.render('error/error'));
  return false;
});
router.post('/', isAuth, verification, (req, res) => {
  Gallery.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
    poster: req.user.username,
  })
    .then((get) => {
      Gallery.findById(get.dataValues.id)
        .then((data) => {
          const arr = [data];
          Gallery.findAll({
            limit: 3,
            order: 'RANDOM()',
          })
            .then((result) => {
              const array = [result[0].dataValues, result[1].dataValues, result[2].dataValues];
              let user = false;
              if (req.user) {
                user = req.user.username;
              }
              return res.render('index/index', {
                gallery: arr,
                pictures: array,
                user,
              });
            })
            .error(() => res.render('error/error'));
        });
    })
    .error(() => res.render('error/error'));
});
router.get('/:id/edit', isAuth, verification, (req, res) => {
  Gallery.findById(req.params.id)
    .then((data) => {
      const arr = [data];
      return res.render('edit/edit', {
        gallery: arr,
        id: req.params.id,
      });
    })
    .error(() => res.render('error/error'));
});
router.put('/:id', isAuth, verification, (req, res) => {
  Gallery.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
  },
    {
      fields: ['author', 'link', 'description'],
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        Gallery.findById(req.params.id)
          .then((data) => {
            const arr = [data];
            Gallery.findAll({
              limit: 3,
              order: 'RANDOM()',
            })
              .then((result) => {
                const array = [result[0].dataValues, result[1].dataValues, result[2].dataValues];
                let user = false;
                if (req.user) {
                  user = req.user.username;
                }
                return res.render('index/index', {
                  gallery: arr,
                  pictures: array,
                  user,
                });
              })
            .error(() => res.render('error/error'));
          });
      })
    .error(() => res.render('error/error'));
});
router.delete('/:id', isAuth, verification, (req, res) => {
  Gallery.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data.rowCount === 0) {
        return res.render('error/error');
      }
      return true;
    });
  Gallery.findAll({
    limit: 20,
    order: 'ID DESC',
  })
    .then((data) => res.render('index/index', { gallery: data }))
    .error(() => res.render('error/error'));
});
router.get('/:id/delete', isAuth, verification, (req, res) => {
  Gallery.findById(req.params.id)
    .then((data) => {
      if (data.dataValues.poster === req.user.username) {
        Gallery.destroy({
          where: {
            id: req.params.id,
          },
        })
        .then(() => {
          Gallery.findAll({
            where: {
              poster: req.user.username,
            },
          })
          .then((posts) => {
            res.render('profile/profile', {
              username: req.user.username,
              posts,
            });
          })
          .error(() => res.render('error/error'));
        })
        .error(() => res.render('error/error'));
      }
    });
});
router.get('/', (req, res) => {
  Gallery.findAll({
    limit: 20,
    order: 'ID DESC',
  })
    .then((data) => {
      let user = false;
      if (req.user) {
        user = req.user.username;
      }
      return res.render('index/index', {
        gallery: data,
        user,
      });
    })
    .error(() => res.render('error/error'));
});
router.get('*', (req, res) => res.render('notFound/404'));

module.exports = router;
