module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('orderItem', {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
           // allowNull: false,
            validate: {
               // notNull: true,
                isInt: true
            }
        },
        specialInstructions: {
            type: DataTypes.TEXT
        }
    });

    return OrderItem;
}