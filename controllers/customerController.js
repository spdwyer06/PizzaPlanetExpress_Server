const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const Customer = require('../db').import('../models/customer');

router.route('/')
    // Create Customer
    .post(validateToken, async(req, res) =>{
        const customerModel = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber
        };

        try{
            const customer = await Customer.create(customerModel);
            res.status(200).json({
                Message: 'Customer Successfully Created',
                Customer: customer
            });
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    })
    // Get All Customers
    .get(validateToken, async(req, res) => {
        try{
            const customers = await Customer.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
            if(customers.length > 0){
                res.status(200).json({Customers: customers});
            }
            else{
                res.status(418).json({Message: 'No Customers In System Yet'});
            }
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    });

// Get Customer By Customer Id
router.get('/:customerId', validateToken, async(req, res) => {
    try{
        const customer = await Customer.findOne({where: {id: req.params.customerId}, attributes: {exclude: ['createdAt', 'updatedAt']}});
        if(customer){
            res.status(200).json({Customer: customer});
        }
        else{
            res.status(502).json({Error: `No Customer Found Matching Customer Id: ${req.params.customerId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get Customer By Last Name
router.get('/name/:lastName', validateToken, async(req, res) => {
    try{
        const customers = await Customer.findAll({where: {lastName: req.params.lastName}, attributes: {exclude: ['createdAt', 'updatedAt']}});
        if(customers.length > 0){
            res.status(200).json({Customers: customers});
        }
        else{
            res.status(502).json({Error: `No Customer(s) Found With Last Name: ${req.params.lastName}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get Customer By Phone Number
router.get('/phone/:number', validateToken, async(req, res) => {
    try{
        const customer = await Customer.findOne({where: {phoneNumber: req.params.number}, attributes: {exclude: ['createdAt', 'updatedAt']}});
        if(customer){
            res.status(200).json({Customer: customer});
        }
        else{
            res.status(502).json({Error: `No Customer Found With Phone Number: ${req.params.number}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Update Customer By Customer Id
router.put('/:customerId', validateToken, async(req, res) => {
    const customerModel = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber
    };

    try{
        if(await Customer.findOne({where: {id: req.params.customerId}})){
            await Customer.update(customerModel, {where: {id: req.params.customerId}});
                res.status(200).json({Message: 'Customer Successfully Updated'});
        }
        else{
            res.status(502).json({Error: `No Customer Found Matching Customer Id: ${req.params.customerId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }

});

// Delete Customer By Customer Id (manager auth)
router.delete('/:customerId', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            if(await Customer.findOne({where: {id: req.params.customerId}})){
                await Customer.destroy({where: {id: req.params.customerId}});
                res.status(200).json({Message: 'Customer Succesfully Removed From System'});
            }
            else{
                res.status(502).json({Error: `No Customer Found Matching Customer Id: ${req.params.customerId}`});
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
    