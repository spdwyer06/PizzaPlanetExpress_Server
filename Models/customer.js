module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customer', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        phoneNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                len: {
                    args: [10, 10],
                    msg: 'Enter 10-digit phone number (including area code)'
                }
            }
        }
    });

    return Customer;
}