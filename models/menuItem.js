module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('menuItem', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlpha: true,
                notEmpty: {
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
                    msg: 'Enter the item price.'
                }
            },
            get(){
                return parseFloat(this.getDataValue('price'));
            }
        }
    });

    return MenuItem;
}