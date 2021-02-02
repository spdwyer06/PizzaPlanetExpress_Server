const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('order', {
        orderTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get(){
                return moment(this.getDataValue('orderTime')).format('MM/DD/YYYY h:mm:ss');
            }
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
            validate: {
                isDecimal: true
            },
            get(){
                return parseFloat(this.getDataValue('totalPrice'));
            }
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    // Order.associate = models => Order.hasMany(models.MenuItem);

    return Order;
}