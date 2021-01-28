const router = require('express').Router();
const validateToken = require('../Middleware/validateToken');
const Order = require('../db').import('../Models/order');
const MenuItem = require('../db').import('../Models/menuItem');
const User = require('../db').import('../Models/user');
const Customer = require('../db').import('../Models/customer');
const OrderItem = require('../db').import('../Models/orderItem');



// Create Starting Order
router.post('/create/:customerId', validateToken, async(req, res) => {
    try{
        const customer = await Customer.findOne({where: {id: req.params.customerId}});
        if(customer){
            const orderModel = {
                userId: req.user.id,
                customerId: customer.id,
                isPaid: req.body.isPaid
            };
    
            const order = await Order.create(orderModel);
            res.status(200).json({
                Message: 'Starting Order Successfully Created',
                //? Needed since order will just be an empty order to begin with???
                OrderId: order.id
            });
        }
        else{
            res.status(500).json({Error: `No Customer Found Matching Customer Id: ${req.params.customerId}`});
        }
    }
    catch{
        res.status(200).json({Error: err});
    }
});

// Add A Item To Order By Order Id
router.put('/food/:itemId/add/:orderId', validateToken, async(req, res) => {
    try{
        const order = await Order.findOne({where: {id: req.params.orderId}});

        const orderTotal = order.totalPrice;
        console.log('PrevTotal', orderTotal);

        if(order){
            const menuItem = await MenuItem.findOne({where: {id: req.params.itemId}});
    
            if(menuItem){
                const addItem = await OrderItem.create({
                    orderId: order.id,
                    menuItemId: menuItem.id,
                    quantity: req.body.quantity,
                    specialInstructions: req.body.specialInstructions
                });

                const newOrderTotal = {
                   totalPrice: (orderTotal + addItem.quantity * menuItem.price)
                };
                console.log('NewTotal', newOrderTotal.totalPrice);
                    
                await Order.update(newOrderTotal, {where: {id: order.id}});

                res.status(200).json({Added_Item: ([`Items Added To Order #${order.id}:`, `${addItem.quantity} x ${menuItem.name.charAt(0).toUpperCase() + menuItem.name.slice(1)}`])});
            }
            else{
                res.status(500).json({Error: `No Menu Item Found Matching Id: ${req.params.itemId}`});
            }
        }
        else{
            res.status(500).json({Error: `No Order Found Matching Order Id: ${req.params.orderId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Update Order Item Quantity
router.put('/food/:itemName/update/:orderId', validateToken, async(req, res) => {
    try{
        const order = await Order.findOne({where: {id: req.params.orderId}});

        const orderTotal = order.totalPrice;
        console.log('PrevTotal', orderTotal);

        if(order){
            const menuItem = await MenuItem.findOne({where: {name: req.params.itemName}});
    
            if(menuItem){
                const orderItem = await OrderItem.findOne({where: {orderId: order.id, menuItemId: menuItem.id}});

                if(orderItem){
                    try{
                        await OrderItem.update({quantity: req.body.quantity}, {where: {orderId: order.id, menuItemId: menuItem.id}});

                        const newOrderTotal = {
                            totalPrice: (req.body.quantity * menuItem.price)
                         };
     
                         console.log('NewTotal', newOrderTotal.totalPrice);
                             
                         await Order.update(newOrderTotal, {where: {id: order.id}});

                        res.status(200).json({Message: 'Order item successfully updated'});
                    }
                    catch(err){
                        res.status(500).json({Error: err.Message});
                    }

                    // const newOrderTotal = {
                    //    totalPrice: (orderTotal + req.body.quantity * menuItem.price)
                    // };

                    // console.log('NewTotal', newOrderTotal.totalPrice);
                        
                    // await Order.update(newOrderTotal, {where: {id: order.id}});
                }
                else{
                    res.status(500).json({Error: `Menu Item Is Not On Order Id: ${req.params.orderId}`});
                }
            }
            else{
                res.status(500).json({Error: `No Menu Item Found Matching Name: ${req.params.itemName}`});
            }
        }
        else{
            res.status(500).json({Error: `No Order Found Matching Order Id: ${req.params.orderId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});



// Add A Item To Order By Order Id (Needs Refactored => Won't Add Duplicates)
// router.put('/food/:itemId/add/:orderId', validateToken, async(req, res) => {
//     try{
//         const order = await Order.findOne({where: {id: req.params.orderId}});

//         if(order){
//             const menuItem = await MenuItem.findOne({where: {id: req.params.itemId}});
    
//             if(menuItem){
//                 const addItem = await order.addMenuItem(menuItem, {through: {quantity: req.body.quantity, specialInstructions: req.body.specialInstructions}});
                    
//                 res.status(200).json({Added_Item: `Added ${menuItem.name} to Order #${order.id}`});
//             }
//             else{
//                 res.status(500).json({Error: `No Menu Item Found Matching Id: ${req.params.itemId}`});
//             }
//         }
//         else{
//             res.status(500).json({Error: `No Order Found Matching Order Id: ${req.params.orderId}`});
//         }
//     }
//     catch(err){
//         res.status(500).json({Error: err});
//     }
// });

// Add Items To Order By Order Id (OLD)
// router.put('/add/:orderId', validateToken, async(req, res) => {
//     let orderTotal = 0;

//     if(await Order.findOne({where: {id: req.params.orderId}})){
//         for(const itemId of req.body.orderDetail){
//             const item = await MenuItem.findOne({where: {id: itemId}});
//             if(item){
//                 orderTotal += parseFloat(item.price).valueOf(item.price);
//             }
//             else{
//                 res.status(500).json({
//                     Error: `No Item Found In System Matching Menu Item Id: ${itemId}`,
//                     '?': 'Contact Technical Support For Assistance'
//                 });
//             }
//         }
    
//         const orderModel = {
//             // Have include name of menu item
//             orderDetail: req.body.orderDetail,
//             totalPrice: orderTotal
//         };
    
//         try{
//             await Order.update(orderModel, {where: {id: req.params.orderId}});
//             res.status(200).json({Message: 'Item(s) added to order'});
//         }
//         catch(err){
//             res.status(500).json({Error: err});
//         }
//     }
//     else{
//         res.status(502).json({Error: `No Order Found Matching Order Id: ${req.params.orderId}`});
//     }

// });


// Get All Orders
router.get('/all', validateToken, async(req, res) => {
    try{
        let orders = await Order.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}, include: [
            // {model: User, as: 'Employee', attributes: ['firstName', 'lastName']},
            {model: User, attributes: ['firstName', 'lastName']},
            {model: MenuItem, attributes: ['name', 'price'], through: {attributes: ['quantity']}}, 
            {model: Customer, attributes: ['firstName', 'lastName', 'phoneNumber']},
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
        const orders = await Customer.findAll({where: {phoneNumber: req.params.phone}});
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
            const orders = await Order.findAll({where: {userId: req.params.userId}, attributes: {exclude: ['createdAt', 'updatedAt', 'userId']}});
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
        const orders = await Order.findAll({where: {isPaid: false}, attributes: {exclude: ['createdAt', 'updatedAt', 'isPaid']}});
        if(orders.length > 0){
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
        const orders = await Order.findAll({where: {isPaid: true}, attributes: {exclude: ['createdAt', 'updatedAt', 'isPaid']}});
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
            res.status(200).json({Message: 'Order Successfully Updated'});
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
                res.status(200).json({Message: 'Order Has Been Removed From System'});
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