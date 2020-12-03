module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Enter a first name.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {notEmpty: true}
        },
        password: {
            type: DataTypes.INTEGER,
            allowNull: false,
            isInt: true,
            len: [4, 4],
            validate: {notEmpty: true}
        },
        passwordEncrypted: {
            type: DataTypes.STRING
        },
        isManager: {
            type: DataTypes.BOOLEAN,
        }
    });

    return User;
}