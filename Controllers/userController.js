const router = require('express').Router();
const User = require('../db').import('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateUser = require('../Middleware/validateUser');

// User Create
router.post('/create', (req, res) => {
    const userModel = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        passwordEncrypted: bcrypt.hashSync(req.body.password.toString(), 13),
        // passwordEncrypted: bcrypt.encodeBase64(req.body.password, 13),
        isManager: req.body.isManager
    };

    User.create(userModel)
        .then(user => {
            const token = jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '7d'});

            res.status(200).json({
                user: user,
                token: token,
                message: 'User successfully created'
            });
        })
        .catch(err => res.status(500).json({error: err}));
});

// User Login
router.post('/login', (req, res) => {
    User.findOne({where: {password: req.body.password}})
        .then(user => {
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
                res.status(500).json({error: 'User does not exist'});
            }
        })
        .catch(err => res.status(500).json({error: err}));
});




module.exports = router;