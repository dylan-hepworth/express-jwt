import User from '../models/user';
import Order from '../models/order';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const controller = {};

controller.findAllOrders = (req, res) => {
    Order.find({})
        .populate('user')
        .exec()
        .then(orders => {
            return res.status(200).json(orders);
        })
        .catch(err => {
            return res.status(400).json(err);
        });
};

controller.createOrder = (req, res) => {
    const order = {
        prodName: req.body.prodName,
        user: req.body.userId
    };

    Order.create(order, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(result);
    });
};

controller.findAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json(users);
    });
};

controller.createUser = (req, res) => {
    User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) return res.status(409).json({ error: 'Email already exists' });
                
                password: bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) return res.status(500).json({error: err});
                    else {
                        const user = {
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: hash
                        };
            
                        User.create(user, (err, result) => {
                            if (err) return res.status(500).json(err);
                            return res.status(201).json(result);
                        });
                    }
                });
            });  
};

controller.deleteUser = (req, res) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({ message: 'User removed' });
        })
        .catch(err => {
            res.send(500).json({ error: err });
        });
};

controller.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ 
                    message: 'Authentication failed' 
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) return res.status(401).json({ message: 'Authentication failed' });
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, config.jwtKey, 
                    {
                        expiresIn: "1h"
                    });

                    return res.status(200).json({ 
                        message: 'Authorization successful',
                        token 
                    });
                } else {
                    return res.status(401).json({ 
                        message: 'Authentication failed' 
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

export default controller;