const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const Bank = sequelize.define('Bank',{
    id:{
        primaryKey: true,
        autoIncrement: true,
        type:DataTypes.INTEGER
    },
    bank:{
        type:DataTypes.STRING,
        allowNull: false
    }

    },{
    tableName:'bank',
    timestamps:false
}
);
Bank.sync();

module.exports = Bank;