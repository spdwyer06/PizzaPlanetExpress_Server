const Order = require('./order');
const MenuItem = require('./menuItem');

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('orderItem', {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
                isInt: true
            }
        },
        specialInstructions: {
            type: DataTypes.TEXT
        }
    },
    {timestamps: false});

    return OrderItem;
}