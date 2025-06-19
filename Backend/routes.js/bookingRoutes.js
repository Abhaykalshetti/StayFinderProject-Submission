import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controller/bookController.js';
import  {protect, authorizeRoles}  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/', protect, authorizeRoles('admin'), getAllBookings); // Only admin can see all bookings
router.put('/:id/status', protect, updateBookingStatus); // Host of listing or admin

export default router;