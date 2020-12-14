const router = require('express').Router();
const User = require('../db').import('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateToken = require('../Middleware/validateToken');
// const validateManager = require('../Middleware/validateManager');

// Create User
router.post('/create', async(req, res) => {
    try{
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
            Message: 'User successfully created'
        });
    }
    catch(err){
        res.status(500).json({Error: err});
    }

    // Promise Chain
    // const userModel = {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     password: req.body.password,
    //     passwordEncrypted: bcrypt.hashSync(req.body.password.toString(), 13),
    //     // passwordEncrypted: bcrypt.encodeBase64(req.body.password, 13),
    //     isManager: req.body.isManager,
    //     isAdmin: req.body.isAdmin
    // };

    // User.create(userModel)
    //     .then(user => {
    //         const token = jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});

    //         res.status(200).json({
    //             User: user,
    //             User_Token: token,
    //             Message: 'User successfully created'
    //         });
    //     })
    //     .catch(err => res.status(500).json({Error: err}));
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
                        message: 'User successfully logged in'
                    });
                }
                else{
                    res.status(502).json({error: 'Login Failed'});
                }
            });
        }
        else{
            res.status(500).json({Error: 'User does not exist'});
        }
    }
    catch(err){
        res.status(500).json({Error: err});
    }

    // Promise Chain
    // User.findOne({where: {password: req.body.password}})
    //     .then(user => {
    //         if(user){
    //             bcrypt.compare(req.body.password.toString(), user.passwordEncrypted, (err, match) => {
    //                 if(match){
    //                     const token = jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});
                        
    //                     res.status(200).json({
    //                         user: user,
    //                         token: token,
    //                         message: 'User successfully logged in'
    //                     });
    //                 }
    //                 else{
    //                     res.status(502).json({error: 'Login Failed'});
    //                 }
    //             });
    //         }
    //         else{
    //             res.status(500).json({error: 'User does not exist'});
    //         }
    //     })
    //     .catch(err => res.status(500).json({error: err}));
});

// Get All Users
router.get('/all', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const users = await User.findAll();
            res.status(200).json({Users: users});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }

    // Promise Chain
    // if(req.user.isManager == true){
    //     User.findAll()
    //         .then(users => res.status(200).json({Users: users}))
    //         .catch(err => res.status(500).json({Error: err}));
    // }
    // else{
    //     res.status(403).json({Error: 'Not Authorized'});
    // }
});

// Get A User By Id
router.get('/:userId', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const user = await User.findOne({where: {id: req.params.userId}});

            if(user){
                res.status(200).json({User: user});
            }
            else{
                res.status(500).json({Error: 'User does not exist'});
            } 
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }

    // Non Ansync (Promise Chain)
    // if(req.user.isManager == true){
    //     User.findOne({where: {id: req.params.userId}})
    //         .then(user => {
    //             if(user){
    //                 res.status(200).json({User: user})
    //             }
    //             else{
    //                 res.status(500).json({Error: 'User does not exist'})
    //             }
    //         })
    //         .catch(err => res.status(500).json({Error: err}));
    // }
    // else{
    //     res.status(403).json({Error: 'Not Authorized'});
    // }
});

// Update A User By Id
router.put('/:userId', validateToken, async(req, res) => {
    if(req.user.isManager){
        try{
            const userModel = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                isManager: req.body.isManager,
                isAdmin: req.body.isAdmin
            };

            await User.update(userModel, {where: {id: req.params.userId}});
            res.status(200).json({Updated_User: 'Successfully updated user'});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }


    // Promise Chain
    // const userModel = {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     password: req.body.password,
    //     isManager: req.body.isManager,
    //     isAdmin: req.body.isAdmin
    // };

    // if(req.user.isManager == true){
    //     User.update(userModel, {where: {id: req.params.userId}})
    //         .then(user => res.status(200).json({Updated_User: 'Successfully updated user'}))
    //         .catch(err => res.status(500).json({Error: err}));
    // }
    // else{
    //     res.status(403).json({Error: 'Not Authorized'});
    // }
});

// Delete A User By Id
router.delete('/:userId', validateToken, async(req, res) => {
    if(req.user.isAdmin){
        try{
            await User.destroy({where: {id: req.params.userId}});
            res.status(200).json({User_Delete: 'User has been removed from the system'});
        }
        catch(err){
            res.status(500).json({Error: err});
        }
    }
    else{
        res.status(403).json({Error: 'Not Authorized'});
    }

    // Promise Chain
    // if(req.user.isManager == true){
    //     User.destroy({where: {id: req.params.userId}})
    //         .then(() => res.status(200).json({User_Delete: 'User has been removed from the system'}))
    //         .catch(err => res.status(500).json({Error: err}));
    // }
    // else{
    //     res.status(403).json({Error: 'Not Authorized'});
    // }
});



module.exports = router;