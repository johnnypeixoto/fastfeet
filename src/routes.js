import { Router } from 'express';

import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import OrderController from './app/controllers/OrderController';
import DeliveryProblemController from './app/controllers/DeliveryProbemController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

// Order Controller
router.get('/view/:deliverymanId', OrderController.index);
router.get('/deliveryman/:deliverymanId/deliveries', OrderController.show);
router.post('/order/:deliveryId/start/:deliverymanId', OrderController.start);
router.put(
  '/order/:deliveryId/end/:deliverymanId',
  upload.single('file'),
  OrderController.end
);
router.post('/delivery/:deliveryId/problem', OrderController.store);

router.post('/sessions', SessionController.store);
router.use(authMiddleware);
router.post('/users', UserController.store);

// Recipient Controller
router.get('/recipients', RecipientController.index);
router.post('/recipients', RecipientController.store);
router.put('/recipients/:recipientId', RecipientController.update);
router.delete('/recipients/:recipientId', RecipientController.delete);

// Deliverynan Controller
router.get('/deliverymans', DeliverymanController.index);
router.post('/deliverymans', DeliverymanController.store);
router.put('/deliverymans/:deliverymanId', DeliverymanController.update);
router.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

// Delivery Controller
router.get('/deliveries', DeliveryController.index);
router.post('/deliveries', DeliveryController.store);
router.put('/deliveries/:deliveryId', DeliveryController.update);
router.delete('/deliveries/:deliveryId', DeliveryController.delete);

// Problems Controller
router.get('/delivery/problems', DeliveryProblemController.index);
router.get('/delivery/:deliveryId/problems', DeliveryProblemController.show);
router.delete('/order/:problemId/cancel/', DeliveryProblemController.delete);

router.post('/files', upload.single('file'), FileController.store);

export default router;
