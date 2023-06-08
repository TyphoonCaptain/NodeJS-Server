const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User_Schema');

exports.get_all_user = (req, res, next) => {
    User.find()
    .select('_id name phone email password')
    .exec()
    .then(docs => {
        
        if(docs.length > 0){
            res.status(200).json({
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        phone: doc.phone,
                        email: doc.email,
                        password: doc.password,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + doc._id
                        }
                    }
                })
            });
        }else{
            res.status(404).json({message: 'No entries found'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.user_signup = (req, res, next) => {

    // Check if email exists
    User.find({email: req.body.email}).exec().then(mailcount => {
        if(mailcount.length >= 1){
            return res.status(409).json({message: 'Mail exists'});
        }
        else
        {
            // Check if phone exists
            User.find({phone: req.body.phone}).exec().then(phonecount => {
                if(phonecount.length >= 1){
                    return res.status(409).json({message: 'Phone exists'});
                }
                // Check if password is at least 8 characters
                else if(req.body.password.length < 8){
                    return res.status(409).json({message: 'Password must be at least 8 characters'});
                }
                else
                {
                    // Hash password
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if(err){
                            return res.status(500).json({error: err});
                        }else{
                            console.log(req.body.email);
                            const newUser = new User({
                                _id: new mongoose.Types.ObjectId(),
                                name: req.body.name,
                                phone: req.body.phone,
                                email: req.body.email,
                                password: hash
                            });
                            
                            newUser.save().then(result => {
                                console.log(result);
                                res.status(201).json({ // 201: Created
                                    message: 'Handling POST requests to /users',
                                    createdUser: result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err});
                            });
                        }
                    
                    });
                }
            });
        }
    });
}

exports.user_login = (req, res, next) => {
    console.log(req.body)
    // Check if phone exists
    User.find({phone: req.body.phone}).exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({message: 'Auth failed'});
        }
        // Check if password is correct
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({message: 'Auth failed'});
            }
            if(result){
                const token = jwt.sign({
                    phone: user[0].phone,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                )

                return res.status(200).json({message: 'Auth successful', token: token});
            }
            res.status(401).json({message: 'Auth failed'});
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id).exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    }
    ).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
}

exports.update_user = (req, res, next) => {
    const id = req.params.userId;
    User.findOneAndUpdate({_id: id}, req.body, {new: true}).exec().then(result => {
        console.log(result);
        res.status(200).json({result, message: 'User UPDATED'});
    }
    ).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.change_password = (req, res, next) => {
    const id = req.params.userId;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    User.findOne({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Auth failed' });
            }

            bcrypt.compare(oldPassword, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth failed' });
                }
                if (!result) {
                    return res.status(401).json({ message: 'Invalid old password' });
                }

                // Check if new password is at least 8 characters
                if (newPassword.length < 8) {
                    return res.status(409).json({ message: 'Password must be at least 8 characters' });
                }

                // Hash the new password
                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        user.password = hash;
                        user.save()
                            .then(() => {
                                return res.status(200).json({ message: 'Password changed' });
                            })
                            .catch(err => {
                                return res.status(500).json({ error: err });
                            });
                    }
                });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err });
        });
};


exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndDelete(id).exec().then(result => {
        res.status(200).json({result, message: 'User DELETED'});
    }
    ).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

}