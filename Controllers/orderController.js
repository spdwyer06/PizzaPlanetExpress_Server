const router = require('express').Router();
const Order = require('../db').import('../Models/order');
const validateToken = require('../Middleware/validateToken');

// Create An Order
router.post('/create', validateToken, (req, res) => {
    const orderModel = {
        employeeId: req.user.id,
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        totalPrice: req.body.totalPrice,
        orderDetail: req.body.orderDetail,
        isPaid: req.body.isPaid
    };

    Order.create(orderModel)
        .then(order => res.status(200).json({
            Message: 'Order successfully created',
            Order: order
        }))
        .catch(err => res.status(200).json({Error: err}));
});

// Get All Orders
router.get('/all', validateToken, (req, res) => {
    Order.findAll()
            .then(orders => res.status(200).json({Orders: orders}))
            .catch(err => res.status(500).json({Error: err}));
});

// Get Order By Order Id
router.get('/:orderId', validateToken, (req, res) => {
    Order.findOne({where: {id: req.params.orderId}})
        .then(order => res.status(200).json({Order: order}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Orders By Customer Phone Number
router.get('/:phone', validateToken, (req, res) => {
    Order.findAll({where: {customerPhoneNumber: req.params.phone}})
        .then(orders => res.status(200).json({Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Orders By User Id
router.get('/:userId', validateToken, (req, res) => {
    Order.findAll({where: {userId: req.params.userId}})
        .then(orders => res.status(200).json({Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Un-paid Orders
router.get('/unpaid', validateToken, (req, res) => {
    Order.findAll({where: {isPaid: false}})
        .then(orders => res.status(200).json({Unpaid_Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Paid Orders
router.get('/paid', validateToken, (req, res) => {
    Order.findAll({where: {isPaid: true}})
        .then(orders => res.status(200).json({Paid_Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Update Order By Order Id
router.put('/:orderId', validateToken, (req, res) => {
    const orderModel = {
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        totalPrice: req.body.totalPrice,
        isPaid: req.body.isPaid
    };

    Order.update(orderModel, {where: {id: req.params.orderId}})
        .then(() => res.status(200).json({Message: 'Order successfully updated'}))
        .catch(err => res.status(500).json({Error: err}));
});

// Delete Order By Order Id
router.delete('/:orderId', validateToken, (req, res) => {
    if(req.user.isManager || req.user.isAdmin){
        Order.destroy({where: {id: req.params.orderId}})
            .then(() => res.status(200).json({Message: 'Order has been removed from system'}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});



module.exports = router;