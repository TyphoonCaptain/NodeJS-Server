const mongoose = require('mongoose');
const Request = require('../models/Calling_Help_Schema');
const User = require('../models/User_Schema');

// Get all requests
exports.get_all_request = (req, res, next) => {
    Request.find()
    .select('_id userId requestType requestQuantity requestDate requestTime')
    .populate('userId')
    .exec()
    .then(docs => {
        
        if(docs.length > 0){
            res.status(200).json({
                count: docs.length,
                requests: docs.map(doc => {
                    return {
                        _id: doc._id,
                        userId: doc.userId,
                        requestType: doc.requestType,
                        requestQuantity: doc.requestQuantity,
                        requestDate: doc.requestDate,
                        requestTime: doc.requestTime,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/requests/' + doc._id
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

exports.request_create = (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            } else {
                const request_call = new Request({
                    _id: new mongoose.Types.ObjectId(),
                    userId: req.body.userId,
                    requestType: req.body.requestType,
                    requestQuantity: req.body.requestQuantity,
                    location: {
                        X: req.body.location.X,
                        Y: req.body.location.Y
                    },
                    requestDate: req.body.requestDate,
                    requestTime: req.body.requestTime
                });

                request_call.save()
                    .then(createdRequest => {
                        res.status(201).json({
                            message: 'Request created successfully',
                            createdRequest: {
                                _id: createdRequest._id,
                                userId: createdRequest.userId,
                                requestType: createdRequest.requestType,
                                requestQuantity: createdRequest.requestQuantity,
                                location: {
                                    X: createdRequest.location.X,
                                    Y: createdRequest.location.Y
                                },
                                requestDate: createdRequest.requestDate,
                                requestTime: createdRequest.requestTime
                            },
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/requests/' + createdRequest._id
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Failed to create request',
                            error: err
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Failed to find user',
                error: err
            });
        });
}

// Get request by id
exports.get_request = (req, res, next) => {
    const id = req.params.requestId;
    Request.findById(id).exec().then(doc => {
        if(doc){
            res.status(200).json({
                request: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/requests'
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

// Update request by id
exports.update_request = (req, res, next) => {
    const id = req.params.requestId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Request.update({_id: id}, {$set: updateOps}).exec().then(result => {
        res.status(200).json({
            message: 'Request updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/requests/' + id
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

// Delete request by id
exports.delete_request = (req, res, next) => {
    const id = req.params.requestId;
    Request.findByIdAndDelete(id).exec().then(result => {
        res.status(200).json({
            message: 'Request deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/requests',
                body: {userId: 'ID', requestType: 'String', requestQuantity: 'Number', requestDate: 'Date', requestTime: 'String'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}