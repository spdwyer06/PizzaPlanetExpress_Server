const router = require('express').Router();
const Hours = require('../db').import('../Models/hours');
const e = require('express');
const validateToken = require('../Middleware/validateToken');

// Create Hours (Clock-In)
router.post('/clockIn', validateToken, (req, res) => {
    // let today = new Date();
    // // const day = String(today.getDate()).padStart(2, '0');
    // // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = today.getDay();
    // const month = today.getMonth() + 1;
    // const year = today.getFullYear();
    // today = `${month}/${day}/${year}`;

    // const hour = today.getHours();
    // const minute = today.getMinutes();
    // const second = today.getSeconds();

    // const rightNow = new Date(hour, minute, second);

    let rightNow = new Date();
    const hour = rightNow.getHours();
    const minute = rightNow.getMinutes();
    const second = rightNow.getSeconds();
    rightNow = `${hour}:${minute}:${second}`;
    
    const today = new Date().toLocaleDateString();
    // console.log('!!!!!!!!!!!aelefselfsaswijdswl!!!!!', today);

    const hoursModel = {
        employeeId: req.user.id,
        date: today,
        clockIn: rightNow,
        userId: req.user.id
    };

    Hours.create(hoursModel)
        .then(hours => res.status(200).json(hours))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Posted Hours (Clock-In & Clock-Out)
router.get('/all', validateToken, (req,res) => {
    if(req.user.isManager){
        Hours.findAll()
            .then(hours => res.status(200).json({Hours: hours}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get All Posted Hours By User Id
router.get('/all/:userId', validateToken, (req, res) =>{
    if(req.user.isManager){
        Hours.findAll({where: {userId: req.params.userId}})
            .then(hours => res.status(200).json({
                Message: `All posted hours for Employee Id: ${req.params.userId}`,
                Hours: hours
            }))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get Hours By Hours Id
router.get('/:hoursId', validateToken, (req, res) => {
    Hours.findOne({where: {id: req.params.hoursId}})
        .then(hours => res.status(200).json({Hours: hours}))
        .catch(err => res.status(500).json({Error: err}));
});

// Update Hours By Hour Id (Clock-Out)
router.put('/:hoursId', validateToken, (req, res) => {
    const hoursModel = {
        clockIn: req.body.clockIn,
        clockOut: req.body.clockOut
    };

    if(req.user.isAdmin){
        Hours.update(hoursModel, {where: {id: req.params.hoursId}})
            .then(hours => res.status(200).json({Hours: hours}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Update User Hours By User Id 
router.put('/user/:userId', validateToken, (req, res) => {
    const hoursModel = {
        clockIn: req.body.clockIn,
        clockOut: req.body.clockOut
    };

    if(req.user.isAdmin){
        Hours.update(hoursModel, {where: {userId: req.params.userId}})
            // .then(hours => res.status(200).json({Hours: hours}))
            .then(() => res.status(200).json({Message: 'Hours successfully updated'}))
            .catch(err => res.status(500).json({Error: err}));
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});



module.exports = router;