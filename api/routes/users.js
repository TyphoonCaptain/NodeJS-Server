const express = require('express');
const router = express.Router();

const UserController = require('../controller/user_controller');

router.get('/', UserController.get_all_user);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.get('/:userId', UserController.get_user);

router.patch('/:userId', UserController.update_user);

router.patch('/change_password/:userId', UserController.change_password);

router.delete('/:userId', UserController.delete_user);

module.exports = router;