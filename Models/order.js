// const MenuItem = require('./menuItem');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('order', {
        orderTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            // allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        orderDetail: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        },
        // orderDate: {
        //     type: DataTypes.DATE,
        //     defaultValue: new Date()
        // }
        // orderDetail: {
        //     type: DataTypes.ARRAY(MenuItem),
        // },
        // orderDetail: {
        //     type: DataTypes.STRING,
        //     get(){
        //         const val = this.getDataValue('orderDetail');
        //         return val;
        //     }
        //     // get: () => JSON.parse(this.getDataValue(orderDetail)),
        //     // set: (val) => this.setDataValue('orderDetail', JSON.stringify(val))
        // },
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    // Order.associate = models => Order.hasMany(models.MenuItem);

    return Order;
}