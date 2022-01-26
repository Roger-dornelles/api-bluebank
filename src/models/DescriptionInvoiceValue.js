const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const DescriptionInvoiceValue = sequelize.define('DescritionInvoiceValue',{
    id:{
        primaryKey:true, 
        autoIncrement:true, 
        type:DataTypes.INTEGER
    },
    iduser:{
        type:DataTypes.INTEGER, 
        allowNull:false
    },
    value:{
        allowNull:false,
        type:DataTypes.STRING
    },
    month:{
        type:DataTypes.STRING,
        allowNull:false
    },
    year:{
        allowNull:false,
        type:DataTypes.STRING
    },
    situation:{
        type:DataTypes.STRING
    }

},{
    tableName:'descriptioninvoicevalue',
    timestamps:false
});

module.exports = DescriptionInvoiceValue;