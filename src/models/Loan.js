const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const Loan = sequelize.define('Loan',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    value:{
        type:DataTypes.STRING,
        allowNull:false
    },
    iduser:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    tableName: 'loan',
    timestamps:false
});

Loan.sync();

module.exports = Loan;