// const { Sequelize } = require("sequelize/types");

module.exports = (sequelize, DataTypes) => {
    const Hours = sequelize.define('hours', {
        employeeId: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true
            }
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
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