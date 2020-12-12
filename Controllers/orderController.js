const router = require('express').Router();
const Order = require('../db').import('../Models/order');
const validateToken = require('../Middleware/validateToken');
const MenuItem = require('../db').import('../Models/menuItem');

// Create An Order
router.post('/create', validateToken, (req, res) => {
    const orderModel = {
        userId: req.user.id,
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        // totalPrice: req.body.totalPrice,
        // orderDetail: req.body.orderDetail,
        isPaid: req.body.isPaid
    };

    Order.create(orderModel)
        .then(order => res.status(200).json({
            Message: 'Order successfully created',
            Order: order
        }))
        .catch(err => res.status(200).json({Error: err}));
});

// Add Items To Order By Order Id
router.put('/add/:orderId', validateToken, (req, res) => {
    const items = {
        orderDetail: req.body.orderDetail
    };

    Order.update(items, {where: {id: req.params.orderId}})
        .then(() => res.status(200).json({Message: 'Item(s) added to order'}))
        .catch(err => res.status(500).json({Error: err}));
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
router.get('/cust/:phone', validateToken, (req, res) => {
    Order.findAll({where: {customerPhoneNumber: req.params.phone}})
        .then(orders => res.status(200).json({Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Orders By User Id
router.get('/user/:userId', validateToken, (req, res) => {
    Order.findAll({where: {userId: req.params.userId}})
        .then(orders => res.status(200).json({Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Un-paid Orders
router.get('/paid/unpaid', validateToken, (req, res) => {
    Order.findAll({where: {isPaid: false}})
        .then(orders => res.status(200).json({Unpaid_Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Paid Orders
router.get('/paid/paid', validateToken, (req, res) => {
    Order.findAll({where: {isPaid: true}})
        .then(orders => res.status(200).json({Paid_Orders: orders}))
        .catch(err => res.status(500).json({Error: err}));
});

/*
// Update Order By Order Id
router.put('/:orderId', validateToken, (req, res) => {
    //const order = Order.findOne({where: {id: req.params.orderId}})

    let orderTotal = 0;

    Order.findOne({where: {id: req.params.orderId}})
        .then(order => {
            order.orderDetail.forEach(itemId => {
                MenuItem.findOne({where: {id: itemId}})
                    .then(item => {
                        // orderTotal += parseFloat(item.price).toFixed(2);
                        orderTotal += parseFloat(item.price).valueOf(item.price); // This is working, but the orderTotal isn't getting passed into the next .then()
                        console.log('Menu Item: ', item);
                        console.log('Item Price: ', item.price);
                        console.log('Order Total: ', orderTotal);
                    });
            });
            // console.log('????????????12345563 total', orderTotal);
        })
        // .then(() => console.log('Order Totes: ', orderTotal))
        .then(() => {
            const orderModel = {
                customerFirstName: req.body.customerFirstName,
                customerLastName: req.body.customerLastName,
                customerPhoneNumber: req.body.customerPhoneNumber,
                totalPrice: orderTotal,
                isPaid: req.body.isPaid
            };
            console.log('!!!!!!!342452432', orderModel)
        })
        .then((orderModel) => {
            console.log('Order Total Just Before Update: ', orderTotal);
            // console.log('!!!!!!!342452432', orderModel)
            Order.update(orderModel, {where: {id: req.params.orderId}})
                .then(() => res.status(200).json({Message: 'Order successfully updated'}))
                .catch(err => res.status(500).json({Error: err}));
        });
});
*/

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

//  ?        Async Update Order
router.put('/:orderId', validateToken, async (req, res) => {
    let orderTotal = 0;

    const order = await Order.findOne({where: {id: req.params.orderId}});

    // await order.orderDetail.forEach(async itemId => {
    //     const item = await MenuItem.findOne({where: {id: itemId}});
    //     orderTotal += parseFloat(item.price).valueOf(item.price);

    //     console.log('Menu Item: ', item.name);
    //     console.log('Item Price: ', item.price);
    //     console.log('Order Total: ', orderTotal);
    // });
    
    // IT WORKS!!!!!!!!
    for(const itemId of order.orderDetail){
        const item = await MenuItem.findOne({where: {id: itemId}});
        orderTotal += parseFloat(item.price).valueOf(item.price);
        // orderTotal += item.price;

        console.log('For Of Menu Item: ', item.name);
        console.log('For Of Item Price: ', item.price);
        console.log('For Of Order Total: ', orderTotal);
    }

    const logs = async() => console.log('Order Total After Loop: ', orderTotal);
    await logs();

    const orderModel = {
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        totalPrice: orderTotal,
        isPaid: req.body.isPaid
    };

    console.log('Order Model Total Price: ', orderModel.totalPrice);
    console.log('Order Total Going Into Model: ', orderTotal);

    await Order.update(orderModel, {where: {id: req.params.orderId}});
    res.status(200).json({Message: 'Order successfully updated'});

});



module.exports = router;