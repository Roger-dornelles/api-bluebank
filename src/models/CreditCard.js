const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const CreditCard = sequelize.define('CreditCard',{
  id:{
    primaryKey: true,
    autoIncrement: true,
    type:DataTypes.INTEGER
  },
  limit:{
    type:DataTypes.STRING,
  },
  iduser:{
    allowNull: false,
    type:DataTypes.STRING
  }

},{
  tableName:'creditcard',
  timestamps:false
}
);

module.exports = CreditCard;