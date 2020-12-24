const Order = require('./order');
const MenuItem = require('./menuItem');

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('orderItem', {
        // id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true
        // },

        // orderId: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: Order,
        //         key: 'id'
        //     },
        //     // field: 'orderId'
        // },
        // menuItemId: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: MenuItem,
        //         key: 'id'
        //     },
        //     // field: 'menuItemId'
        // },
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