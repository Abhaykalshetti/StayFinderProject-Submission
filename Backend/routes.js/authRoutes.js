import  express  from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controller/authController.js';
import {protect}  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // Protect this route

export default router;