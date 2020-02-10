import { Router } from 'express';

import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import ViewDeliveriesController from './app/controllers/ViewDeliveriesController';
import OrderController from './app/controllers/OrderController';
import DeliveryProblemController from './app/controllers/DeliveryProbemController';
import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);
router.use(authMiddleware);
router.post('/users', UserController.store);
router.post('/recipients', RecipientController.store);
router.put('/recipients/:recipientId', RecipientController.update);
router.get('/deliverymans', DeliverymanController.index);
router.post('/deliverymans', DeliverymanController.store);
router.put('/deliverymans/:deliverymanId', DeliverymanController.update);
router.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);
router.get('/deliveries', DeliveryController.index);
router.post('/deliveries', DeliveryController.store);
router.put('/deliveries/:deliveryId', DeliveryController.update);
router.delete('/deliveries/:deliveryId', DeliveryController.delete);
router.get('/view/:deliverymanId', ViewDeliveriesController.index);
router.get('/deliveryman/:deliverymanId/deliveries', OrderController.index);
router.post('/order/:deliveryId/start/:deliverymanId', OrderController.store);
router.put(
  '/order/:deliveryId/end/:deliverymanId',
  upload.single('file'),
  OrderController.update
);
router.get('/delivery/problems', DeliveryProblemController.index2);
router.get('/delivery/:deliveryId/problems', DeliveryProblemController.index);
router.post('/delivery/:deliveryId/problem', DeliveryProblemController.store);
router.post('/files', upload.single('file'), FileController.store);

export default router;
