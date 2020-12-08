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
    if(req.user.isManager){
        Order.findAll()
            .then(orders => res.status(200).json({Orders: orders}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get Order By Order Id


// Get All Orders By Customer Phone Number


// Get All Orders By User Id


// Get All Un-paid Orders


// Get All Paid Orders


// Update Order By Order Id


// Delete Order By Order Id




module.exports = router;