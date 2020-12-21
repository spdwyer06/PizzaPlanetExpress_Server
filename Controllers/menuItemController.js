const router = require('express').Router();
const MenuItem = require('../db').import('../Models/menuItem');
const validateToken = require('../Middleware/validateToken');

// Create Menu Item
router.post('/create', validateToken, async(req, res) => {
    if(req.user.isManager == true){
        const menuItemModel = {
            name: req.body.name,
            price: req.body.price
        };
        try{
            const item = await MenuItem.create(menuItemModel);
            res.status(200).json({
                Message: 'Menu Item Successfully Created',
                Menu_Item: item
            });
        }
        catch(err){
            res.status(500).json({Error: err})
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get All Menu Items
router.get('/all', validateToken, async(req, res) => {
        try{
            const items = await MenuItem.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
            if(items.length > 0){
                res.status(200).json({Menu_Items: items});
            }
            else{
                res.status(200).json({Message: 'No Menu Items Created In System Yet'});
            }
        }
        catch(err){
            res.status(500).json({Error: err});
        }
});

// Get Menu Item By Id
router.get('/:itemId', validateToken, async(req, res) => {
        try{
            const item = await MenuItem.findOne({where: {id: req.params.itemId}});
            if(item){
                res.status(200).json({Menu_Item: item});
            }
            else{
                res.status(502).json({Error: `No Menu Item Found Matching Item Id: ${req.params.itemId}`});
            }
        }
        catch(err){
            res.status(500).json({Error: err});
        }
});

// Update Menu Item By Id
router.put('/:itemId', validateToken, async(req, res) => {
    if(req.user.isManager == true){
        const menuItemModel = {
            name: req.body.name,
            price: req.body.price
        };

        if(await MenuItem.findOne({where: {id: req.params.itemId}})){
            try{
                await MenuItem.update(menuItemModel, {where: {id: req.params.itemId}});
                res.status(200).json({Message: 'Menu Item successfully updated'});
            }
            catch(err){
                res.status(500).json({Error: err});
            }
        }
        else{
            res.status(502).json({Error: `No Menu Item Found Matching Menu Item: ${req.params.itemId}`});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Delete Menu Item By Id
router.delete('/:itemId', validateToken, async(req, res) => {
    if(req.user.isManager == true){
        try{
            if(await MenuItem.findOne({where: {id: req.params.itemId}})){
                await MenuItem.destroy({where: {id: req.params.itemId}});
                res.status(200).json({Message: 'Menu Item successfully removed from system'});
            }
            else{
                res.status(502).json({Error: `No Menu Item Found Matching Menu Item: ${req.params.itemId}`});
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