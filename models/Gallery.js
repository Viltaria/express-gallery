module.exports = function(sequelize, DataTypes) {
  // var User = sequelize.define("User", {
  //   username: DataTypes.STRING
  // }, {
  //   classMethods: {
  //     associate: function(models) {
  //       User.hasMany(models.Task);
  //     }
  //   }
  // });
  // return User;
  var Gallery = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  });
  return Gallery;
};