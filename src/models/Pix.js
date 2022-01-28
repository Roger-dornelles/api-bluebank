const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize')

const Pix = sequelize.define('Pix',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iduser:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    value:{
        type:DataTypes.STRING,
        allowNull: false
    },
    pixdestination:{
        type:DataTypes.STRING,
        allowNull: false
    },
    month: {
        type:DataTypes.STRING,
        allowNull: false
    },
    year: {
        type:DataTypes.STRING,
        allowNull: false
    },
    date:{
        type:DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'pix',
    timestamps:false
});

module.exports = Pix;