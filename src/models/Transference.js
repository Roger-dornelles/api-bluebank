const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const Transference = sequelize.define('Transference',{
    id:{
        autoIncrement: true,
        primaryKey: true,
        type:DataTypes.INTEGER
    },
    iduser:{
        allowNull: false,
        type:DataTypes.INTEGER
    },
    bank:{
        allowNull: false,
        type:DataTypes.STRING
    },
    type_destiny_account:{
        allowNull: false,
        type:DataTypes.STRING
    },
    agency:{
        allowNull: false,
        type:DataTypes.STRING
    },
    account:{
        allowNull: false,
        type:DataTypes.STRING
    },
    favored_name:{
        allowNull: false,
        type:DataTypes.STRING
    },
    document:{
        allowNull: false,
        type:DataTypes.STRING
    },
    value:{
        allowNull: false,
        type:DataTypes.STRING
    }

},{
    tableName:'transference',
    timestamps:false
});

module.exports = Transference;