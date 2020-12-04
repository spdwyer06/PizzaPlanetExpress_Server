const router = require('express').Router();
const Hours = require('../db').import('../Models/hours');
const validateToken = require('../Middleware/validateToken');

// Create Hours (Clock-In)
router.post('/clockIn', validateToken, (req, res) => {
    const hoursModel = {
        employeeId: req.user.id
    };

    Hours.create(hoursModel)
        .then(hours => res.status(200).json(hours))
        .catch(err => res.status(500).json({Error: err}));
});

// Get All Posted Hours (Clock-In & Clock-Out)


// Get All Posted Hours By User Id


// Update Hours By Hour Id (Clock-Out)


// Update User Hours By User Id 




module.exports = router;