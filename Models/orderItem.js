module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('orderItem', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isInt: true
            }
        }
    });

    return OrderItem;
}