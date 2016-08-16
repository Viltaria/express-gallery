'use strict';
module.exports = function verification(req, res, next) {
  const body = req.body;
  const supportedFileTypes = ['.tif', '.jpg', '.png', '.jpeg', '.gif'];
  let fileType;
  if (req.method === 'POST') {
    fileType = body.link.slice(body.link.lastIndexOf('.'), body.link.length);
    if (!body.author || !body.link || !body.description) {
      return res.render('error/error');
    } else if (supportedFileTypes.indexOf(fileType) < 0) {
      return res.render('error/error');
    }
  } else if (req.method === 'PUT') {
    fileType = body.link.slice(body.link.lastIndexOf('.'), body.link.length);
    if (supportedFileTypes.indexOf(fileType) < 0) {
      return res.render('error/error');
    }
    for (const key in body) {
      if (!body[key]) return res.render('error/error');
    }
  }
  return next();
};
