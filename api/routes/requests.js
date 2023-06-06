const express = require('express');
const router = express.Router();
const RequestController = require('../controller/request_controller');

router.get('/', RequestController.get_all_request);

router.post('/', RequestController.request_create);

router.get('/:requestId', RequestController.get_request);

router.get('/user/:userId', RequestController.get_request_by_user);

router.patch('/:requestId', RequestController.update_request);

router.delete('/:requestId', RequestController.delete_request);

module.exports = router;