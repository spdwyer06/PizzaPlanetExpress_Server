module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
                notNull: {
                    msg: 'Enter a first name.'
                }
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
        password: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notNull: true,
                isInt: true,
                len: [4, 4],
            }
        },
        passwordEncrypted: {
            type: DataTypes.STRING
        },
        isManager: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
}