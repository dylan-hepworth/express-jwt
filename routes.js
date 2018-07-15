import express from 'express';
import controller from './controllers/';
import checkAuth from './middleware/check-auth';

const router = express.Router();

router.get('/orders', controller.findAllOrders);

router.post('/orders', controller.createOrder);

router.get('/users', checkAuth, controller.findAllUsers);

router.post('/users', controller.createUser);

router.delete('/users/:id', controller.deleteUser);

router.post('/login', controller.login);

export default router;