module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('menuItem', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Enter the item name.'
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                notNull: {
                    msg: 'Enter the item name.'
                }
            }
        }
    });

    return MenuItem;
}