module.exports = (sequelize, DataTypes) => {
    const Hours = sequelize.define('hours', {
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
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