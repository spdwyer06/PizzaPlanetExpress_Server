const router = require('express').Router();
const validateToken = require('../Middleware/validateToken');
const Order = require('../db').import('../Models/order');
const MenuItem = require('../db').import('../Models/menuItem');
const User = require('../db').import('../Models/user');
const Customer = require('../db').import('../Models/customer');



// Create Starting Order
router.post('/create/:customerId', validateToken, async(req, res) => {
    const orderModel = {
        userId: req.user.id,
        customerId: req.params.customerId,
        isPaid: req.body.isPaid
    };

    try{
        const order = await Order.create(orderModel);
        res.status(200).json({
            Message: 'Starting order successfully created',
            //? Needed since order will just be an empty order to begin with???
            Order: order
        });
    }
    catch{
        res.status(200).json({Error: err});
    }
});

// Add Item By Item Id To Order By Order Id
router.put('/food/:itemId/add/:orderId', validateToken, async(req, res) => {
    try{
        const order = await Order.findOne({where: {id: req.params.orderId}});
        const menuItem = await MenuItem.findOne({where: {id: req.params.itemId}});
        const addItem = await order.addMenuItem(menuItem, {through: {quantity: req.body.quantity, specialInstructions: req.body.specialInstructions}});
        
        res.status(200).json({Added_Item: addItem});
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Add Items To Order By Order Id
router.put('/add/:orderId', validateToken, async(req, res) => {
    let orderTotal = 0;

    if(await Order.findOne({where: {id: req.params.orderId}})){
        for(const itemId of req.body.orderDetail){
            const item = await MenuItem.findOne({where: {id: itemId}});
            if(item){
                orderTotal += parseFloat(item.price).valueOf(item.price);
            }
            else{
                res.status(500).json({
                    Error: `No Item Found In System Matching Menu Item Id: ${itemId}`,
                    '?': 'Contact Technical Support For Assistance'
                });
            }
        }
    
        const orderModel = {
            // Have include name of menu item
            orderDetail: req.body.orderDetail,
            totalPrice: orderTotal
        };
    
        try{
            await Order.update(orderModel, {where: {id: req.params.orderId}});
            res.status(200).json({Message: 'Item(s) added to order'});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(502).json({Error: `No Order Found Matching Order Id: ${req.params.orderId}`});
    }

});

// Get All Orders
router.get('/all', validateToken, async(req, res) => {
    try{
        let orders = await Order.findAll({include: [
            {model: MenuItem, attributes: ['name', 'price'], through: {attributes: []}}, 
            {model: Customer, attributes: ['firstName', 'lastName']}
        ]});
        if(orders.length > 0){
            res.status(200).json({Orders: orders});
        }
        else{
            res.status(418).json({Message: 'No Orders In System Yet'});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get Order By Order Id
router.get('/:orderId', validateToken, async(req, res) => {
    try{
        const order = await Order.findOne({where: {id: req.params.orderId}});
        if(order){
            res.status(200).json({Order: order});
        }
        else{
            res.status(502).json({Error: `No Order Matching Order Id: ${req.params.orderId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Orders By Customer Phone Number
router.get('/cust/:phone', validateToken, async(req, res) => {
    try{
        const orders = await Order.findAll({where: {customerPhoneNumber: req.params.phone}});
        if(orders.length > 0){
            res.status(200).json({Orders: orders});
        }
        else{
            res.status(418).json({Message: "Doesn't look like this customer has placed any orders with us yet..."});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Orders By User Id
router.get('/user/:userId', validateToken, async(req, res) => {
    try{
        if(await User.findOne({where: {id: req.params.userId}})){
            const orders = await Order.findAll({where: {userId: req.params.userId}});
            res.status(200).json({Orders: orders});
        }
        else{
            res.status(502).json({Error: `No Matching User With User Id: ${req.params.userId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Un-paid Orders
router.get('/paid/unpaid', validateToken, async(req, res) => {
    try{
        const orders = await Order.findAll({where: {isPaid: false}});
        if(order.length > 0){
            res.status(200).json({Unpaid_Orders: orders});
        }
        else{
            res.status(418).json({Message: 'No Unpaid Orders At This Time'});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Paid Orders
router.get('/paid/paid', validateToken, async(req, res) => {
    try{
        const orders = await Order.findAll({where: {isPaid: true}});
        if(orders.length > 0){
            res.status(200).json({Paid_Orders: orders});
        }
        else{
            res.status(418).json({Message: 'No Paid Orders At This Time'});
        }
    }
    catch{
        res.status(500).json({Error: err});
    }
});

// Update Order Info By Order Id
router.put('/:orderId', validateToken, async (req, res) => {
    const order = await Order.findOne({where: {id: req.params.orderId}});

    if(await Order.findOne({where: {id: req.params.orderId}})){
        const orderModel = {
            customerFirstName: req.body.customerFirstName,
            customerLastName: req.body.customerLastName,
            customerPhoneNumber: req.body.customerPhoneNumber,
            isPaid: req.body.isPaid
        };
    
        try{
            await Order.update(orderModel, {where: {id: req.params.orderId}});
            res.status(200).json({Message: 'Order successfully updated'});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(502).json({Error: `No Order Matching Order Id: ${req.params.orderId}`});
    }

});

// Delete Order By Order Id
router.delete('/:orderId', validateToken, async(req, res) => {
    if(req.user.isManager || req.user.isAdmin){
        try{
            if(await Order.findOne({where: {id: req.params.orderId}})){
                await Order.destroy({where: {id: req.params.orderId}});
                res.status(200).json({Message: 'Order has been removed from system'});
            }
            else{
                res.status(502).json({Error: `No Order Found Matching Order Id:  ${req.params.orderId}`});
            }
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});




module.exports = router;