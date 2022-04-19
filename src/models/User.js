const { DataTypes } = require('sequelize');
const sequelize = require('../instances/postgres');

const User = sequelize.define('User',{
  id:{
    primaryKey:true,
    autoIncrement: true,
    type:DataTypes.INTEGER,
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  cpf:{
    type:DataTypes.STRING,
    allowNull:false
  }
},{
  tableName:'users',
  timestamps:false

});

User.sync();

module.exports = User;