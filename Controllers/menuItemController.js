const router = require('express').Router();
const MenuItem = require('../db').import('../Models/menuItem');
const validateToken = require('../Middleware/validateToken');

// Create Menu Item
router.post('/create', validateToken, (req, res) => {
    if(req.user.isManager == true){
        const menuItemModel = {
            name: req.body.name,
            price: req.body.price
        };

        MenuItem.create(menuItemModel)
            .then(item => res.status(200).json({
                Message: 'Menu Item successfully created',

                Menu_Item: item
            }))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get All Menu Items
router.get('/all', validateToken, (req, res) => {
    if(req.user.isManager == true){
        MenuItem.findAll()
            .then(items => res.status(200).json({Menu_Items: items}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get Menu Item By Id
router.get('/:itemId', validateToken, (req, res) => {
    if(req.user.isManager == true){
        MenuItem.findOne({where: {id: req.params.itemId}})
            .then(item => res.status(200).json({Menu_Item: item}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Update Menu Item By Id
router.put('/:itemId', validateToken, (req, res) => {
    if(req.user.isManager == true){
        const menuItemModel = {
            name: req.body.name,
            price: req.body.price
        };

        MenuItem.update(menuItemModel, {where: {id: req.params.itemId}})
            .then(() => res.status(200).json({Message: 'Menu Item successfully updated'}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Delete Menu Item By Id
router.delete('/:itemId', validateToken, (req, res) => {
    if(req.user.isManager == true){
        MenuItem.destroy({where: {id: req.params.itemId}})
            .then(() => res.status(200).json({Message: 'Menu Item successfully removed from system'}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});


module.exports = router;