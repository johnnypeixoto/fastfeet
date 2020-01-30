import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);
router.use(authMiddleware);
router.post('/users', UserController.store);
router.post('/recipients', RecipientController.store);
router.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default router;
