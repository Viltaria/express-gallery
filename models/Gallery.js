module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING,
    poster: DataTypes.STRING,
  });
  return Gallery;
};