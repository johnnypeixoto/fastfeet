import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);
router.use(authMiddleware);
router.post('/users', UserController.store);
router.post('/recipients', RecipientController.store);
router.get('/deliverymans', DeliverymanController.index);
router.post('/deliverymans', DeliverymanController.store);
router.put('/deliverymans/:deliverymanId', DeliverymanController.update);
router.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);
router.post('/files', upload.single('file'), FileController.store);

export default router;
