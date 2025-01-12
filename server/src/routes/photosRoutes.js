import express from 'express';
import * as PhotosController from '../controllers/photosController.js';

const router = express.Router();

router.get('/:orderId/photos', PhotosController.getPhotosByOrderId);

export default router;
