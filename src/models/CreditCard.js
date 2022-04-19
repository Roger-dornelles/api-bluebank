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
    allowNull: false
  },
  iduser:{
    type:DataTypes.STRING,
    allowNull: false
  }

},{
  tableName:'creditcard',
  timestamps:false
}
);
CreditCard.sync();

module.exports = CreditCard;