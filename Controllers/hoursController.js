const router = require('express').Router();
const Hours = require('../db').import('../Models/hours');
// const e = require('express');
const validateToken = require('../Middleware/validateToken');

// Create Hours (Clock-In)
router.post('/clockIn', validateToken, async(req, res) => {
    let rightNow = new Date();
    const hour = rightNow.getHours();
    const minute = rightNow.getMinutes();
    const second = rightNow.getSeconds();
    rightNow = `${hour}:${minute}:${second}`;
    
    const today = new Date().toLocaleDateString();

    const hoursModel = {
        employeeId: req.user.id,
        date: today,
        clockIn: rightNow,
        userId: req.user.id
    };

    try{
        const hours = await Hours.create(hoursModel);
        res.status(200).json(hours);
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Posted Hours (Clock-In & Clock-Out)
router.get('/all', validateToken, async(req,res) => {
    if(req.user.isManager){
        try{
            const hours = await Hours.findAll();
            if(hours.length > 0){
                res.status(200).json({Hours: hours});
            }
            else{
                res.status(502).json({Message: 'No hours posted in system'});
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

// Get All Posted Hours By User Id
router.get('/all/:userId', validateToken, async(req, res) =>{
    if(req.user.isManager){
        try{
            const hours = await Hours.findAll({where: {userId: req.params.userId}});
            if(hours.length > 0){
                res.status(200).json({
                    Message: `All posted hours for Employee Id: ${req.params.userId}`,
                    Hours: hours
                });
            }
            else{
                res.status(502).json({Error: `No Hours Found For User Id: ${req.params.userId}`});
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

// Get Hours By Hours Id
router.get('/:hoursId', validateToken, async(req, res) => {
    try{
        const hours = await Hours.findOne({where: {id: req.params.hoursId}});
        if(hours){
            res.status(200).json({Hours: hours});
        }
        else{
            res.status(502).json({Error: `No Hours Found Matching Hours Id: ${req.params.hoursId}`});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Update Hours By Hour Id (Clock-Out)
router.put('/:hoursId', validateToken, async(req, res) => {
    const hoursModel = {
        clockIn: req.body.clockIn,
        clockOut: req.body.clockOut
    };

    if(req.user.isAdmin){
        try{
            const hoursToUpdate = await Hours.findOne({where: {id: req.params.hoursId}});
            if(hoursToUpdate){
                await Hours.update(hoursModel, {where: {id: req.params.hoursId}});
                res.status(200).json({Update_Hours: 'Successfully updated user hours'});
            }
            else{
                res.status(502).json({Error: `No Hours Found Matching Hours Id: ${req.params.hoursId}`});
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

// Update User Hours By User Id 
router.put('/user/:userId/:hoursId', validateToken, async(req, res) => {
    const hoursModel = {
        clockIn: req.body.clockIn,
        clockOut: req.body.clockOut
    };

    if(req.user.isAdmin){
        try{
            const hours = await Hours.findOne({where:{id: req.params.hoursId}});
            if(hours){
                Hours.update(hoursModel, {where: {userId: req.params.userId, id: req.params.hoursId}});
                res.status(200).json({Message: 'Hours successfully updated'});
            }
            else{
                res.status(502).json({Error: `No Hours Found Matching Hours Id: ${req.params.hoursId}`});
            }
        }
        catch(err){
            res.status(500).json({Error: err})
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});



module.exports = router;