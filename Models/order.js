// const MenuItem = require('./menuItem');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('order', {
        // employeeId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true,
        //         isInt: true
        //     }
        // },
        // orderTime: {
        //     type: DataTypes.DATE
        // },
        customerFirstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        customerLastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        customerPhoneNumber: {
            type: DataTypes.INTEGER
            // validate: {
            //     min: 9,
            //     max: 100,
            //     msg: 'Enter 10-digit phone number (including area code)'
            // }
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
            allowNull: false
        }
    });

    // Order.associate = models => Order.hasMany(models.MenuItem);

    return Order;
}