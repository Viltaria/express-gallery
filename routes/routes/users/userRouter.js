'use strict';
const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const db = require('./../../../models');
const flash = require('connect-flash');

const User = db.User;
const Gallery = db.Gallery;

router.use(flash());

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});
router.get('/register', (req, res) => res.render('register/register'));
router.post('/register', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hash,
        email: req.body.email,
      })
        .then(() => res.redirect(`/user/${req.body.username}`))
        .error(() => res.render('error/error'));
    });
  });
});
router.get('/login', (req, res) => res.render('login/login', { message: req.flash('error') }));
router.get('/me', (req, res) => res.redirect(`/user/${req.user.username}`));
router.get('/:username', (req, res) => {
  Gallery.findAll({
    where: {
      poster: req.params.username,
    },
  })
    .then((data) => {
      let user;
      if (req.user) {
        user = req.user.username;
      }
      if (user === req.params.username) {
        user = 'Your';
      } else {
        user = `${user}'s`;
      }
      return res.render('profile/profile', {
        username: user,
        posts: data,
      });
    });
});

module.exports = router;
