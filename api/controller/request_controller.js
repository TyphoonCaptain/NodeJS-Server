const mongoose = require('mongoose');
const Request = require('../models/Calling_Help_Schema');
const User = require('../models/User_Schema');

// Get all requests
exports.get_all_request = (req, res, next) => {
    Request.find()
    .select('_id userId requestType requestQuantity requestDetails requestPriority location requestDate requestTime')
    //.populate('userId')
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
                        requestDetails: doc.requestDetails,
                        requestPriority: doc.requestPriority,
                        location: doc.location,
                        requestDate: doc.requestDate,
                        requestTime: doc.requestTime
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
                    requestDetails: req.body.requestDetails,
                    requestPriority: req.body.requestPriority,
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
                                requestDetails: createdRequest.requestDetails,
                                requestPriority: createdRequest.requestPriority,
                                location: {
                                    X: createdRequest.location.X,
                                    Y: createdRequest.location.Y
                                },
                                requestDate: createdRequest.requestDate,
                                requestTime: createdRequest.requestTime
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
                result: doc
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.get_request_by_user = (req, res, next) => {
    const id = req.params.userId;
    Request.find({userId: id}).exec().then(doc => {
        if(doc){
            res.status(200).json({
                count: doc.length,
                result: doc
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
    Request.findOneAndUpdate({_id: id}, req.body, {new: true}).exec().then(result => {
        res.status(200).json({
            message: 'Request updated',
            result
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
            result,
            message: 'Request deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}