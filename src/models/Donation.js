const sequelize = require('../instances/postgres');
const { DataTypes } = require('sequelize');

const Donation = sequelize.define('Donation',{
    id:{
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    iduser:{
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    value:{
        allowNull: false,
        type: DataTypes.STRING
    },
    destination:{
        allowNull: false,
        type: DataTypes.STRING
    }
},{
    tableName: 'donation',
    timestamps:false
});

module.exports = Donation;