const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateToken = require('../middleware/validateToken');

//? Add auth here? Only managers+ can create new users? 
// Create User
router.post('/create', async(req, res) => {
    try{
        const users = await User.findAll();
        if(users.length > 0){
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                passwordEncrypted: bcrypt.hashSync(req.body.password.toString(), 13),
                isManager: req.body.isManager,
                isAdmin: req.body.isAdmin
            });

            const token = await jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});
    
            res.status(200).json({
                User: user,
                User_Token: token,
                Message: 'User Successfully Created'
            });
        }
        else{
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                passwordEncrypted: bcrypt.hashSync(req.body.password.toString(), 13),
                isManager: true,
                isAdmin: true
            });

            const token = await jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});
    
            res.status(200).json({
                User: user,
                User_Token: token,
                Message: 'User Successfully Created'
            });
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// User Login
router.post('/login', async(req, res) => {
    try{
        const user = await User.findOne({where: {password: req.body.password}});
        if(user){
            bcrypt.compare(req.body.password.toString(), user.passwordEncrypted, (err, match) => {
                if(match){
                    const token = jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});
                    
                    res.status(200).json({
                        user: user,
                        token: token,
                        message: 'User Successfully Logged In'
                    });
                }
                else{
                    res.status(502).json({error: 'Login Failed'});
                }
            });
        }
        else{
            res.status(500).json({Error: 'User Does Not Exist'});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }
});

// Get All Users
router.get('/all', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const users = await User.findAll({attributes: {exclude: ['passwordEncrypted', 'createdAt', 'updatedAt']}});
            res.status(200).json({Users: users});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }
});

// Get A User By Id
router.get('/:userId', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const user = await User.findOne({where: {id: req.params.userId}, attributes: {exclude: ['passwordEncrypted']}});

            if(user){
                res.status(200).json({User: user});
            }
            else{
                res.status(500).json({Error: `No User Found Matching User Id: ${req.params.userId}`});
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

// Update A User By Id
router.put('/:userId', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const user = await User.findOne({where: {id: req.params.userId}});

            if(user){
                const userModel = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    isManager: req.body.isManager,
                    isAdmin: req.body.isAdmin
                };
    
                await User.update(userModel, {where: {id: req.params.userId}});
                res.status(200).json({Updated_User: 'Successfully Updated User'});
            }
            else{
                res.status(500).json({Error: `No User Found Matching User Id: ${req.params.userId}`});
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

// Delete A User By Id
router.delete('/:userId', validateToken, async(req, res) => {
    if(req.user.isAdmin){
        try{
            const user = await User.findOne({where: {id: req.params.userId}});

            if(user){
                await User.destroy({where: {id: user.id}});
                res.status(200).json({User_Delete: 'User Has Been Removed From The System'});
            }
            else{
                res.status(500).json({Error: `No User Found Matching User Id: ${req.params.userId}`});
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