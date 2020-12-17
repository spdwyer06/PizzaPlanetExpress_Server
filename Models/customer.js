module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customer', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                // Validates that only letters are inserted
                isAlpha: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true
            }
        },
        phoneNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                len: {
                    // Validating that a 10-digit phone number is entered
                    args: [10, 10],
                    msg: 'Enter 10-digit phone number (including area code)'
                }
            }
        }
    });

    return Customer;
}