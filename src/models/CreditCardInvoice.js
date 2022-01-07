const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const CreditCardInvoice = sequelize.define('CreditCardInvoice',{
  id:{
    autoIncrement: true,
    type:DataTypes.INTEGER,
  },
  iduser:{
    primaryKey: true,
    allowNull: false,
    type:DataTypes.INTEGER
  },
  description:{
    type:DataTypes.STRING,
    allowNull: false
  },
  value:{
    allowNull: false,
    type:DataTypes.INTEGER
  },
  parcel: {
    type:DataTypes.INTEGER
  }
},{
  tableName: 'creditcardinvoice',
  timestamps:false
});

module.exports = CreditCardInvoice;