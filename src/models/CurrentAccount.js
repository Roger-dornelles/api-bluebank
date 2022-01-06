const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const CurrentAccount = sequelize.define('CurrentAccount', {
  id:{
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  initialvalue:{
    type: DataTypes.STRING,
  },
  iduser:{
    type: DataTypes.STRING,
    allowNull: false
  },

},{
  tableName : 'currentaccount',
  timestamps : false
});

module.exports = CurrentAccount;