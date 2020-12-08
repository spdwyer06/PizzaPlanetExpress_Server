// const { Sequelize } = require("sequelize/types");
// 'use strict';
module.exports = (sequelize, DataTypes) => {
    const Hours = sequelize.define('hours', {
        // Not needed since it will be automatically be created through db association in db.js
        // employeeId: {
        //     type: DataTypes.INTEGER, 
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true,
        //         isInt: true
        //     }
        // },
        date: {
            type: DataTypes.STRING,
            // defaultValue: DataTypes.NOW
            // defaultValue: Sequelize.NOW
        },
        clockIn: {
            type: DataTypes.TIME,
            defaultValue: DataTypes.NOW
        },
        clockOut: {
            type: DataTypes.TIME
        },
        shiftLength: {
            type: DataTypes.DECIMAL
        }
    });

    return Hours;
}