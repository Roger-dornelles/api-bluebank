const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const CreditCardInvoice = sequelize.define('CreditCardInvoice',{
  id:{
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type:DataTypes.INTEGER,
  },
  iduser:{
    type:DataTypes.INTEGER
  },
  description:{
    type:DataTypes.STRING,
    allowNull: false
  },
  value:{
    allowNull: false,
    type:DataTypes.STRING,
  },
  parcel: {
    type:DataTypes.INTEGER
  },
  date:{
    type: DataTypes.STRING,
    allowNull: false
  },
  month:{
    type:DataTypes.STRING,
    allowNull: false
  },
  installmentvalue:{
    type:DataTypes.STRING,
  },
  year:{
    type:DataTypes.STRING
  }
},{
  tableName: 'creditcardinvoice',
  timestamps:false
});

CreditCardInvoice.sync();

module.exports = CreditCardInvoice;