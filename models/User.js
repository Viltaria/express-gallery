module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {type:DataTypes.STRING, unique: true},
    password: {type:DataTypes.STRING, unique:true},
    email: {type:DataTypes.STRING, unique:true},
    theme : DataTypes.STRING,
  });
  return User;
};