import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
}  from  '../controller/listingController.js'
import  {protect, authorizeRoles}  from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);

// Protected routes (require authentication)
router.post('/', protect, authorizeRoles('host', 'admin'), createListing);
router.put('/:id', protect, updateListing); // Logic inside controller checks ownership/admin
router.delete('/:id', protect, deleteListing); // Logic inside controller checks ownership/admin

export default router;