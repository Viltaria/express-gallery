'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING,
    poster: DataTypes.STRING,
  });
  return Gallery;
};
