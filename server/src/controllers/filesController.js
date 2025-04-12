import * as FilesModel from '../models/filesModel.js';

export async function getPhotosByOrderId(req, res) {
    const { orderId } = req.params;
    try {
        const photos = await FilesModel.getFilesByOrderId(orderId);

        if (photos.length === 0) {
            return res
                .status(404)
                .json({ message: 'No photos found for this order' });
        }

        const photoData = photos.map((photo) => ({
            id: photo.id,
            file: photo.file.toString('base64'),
        }));

        res.status(200).json(photoData);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting photos',
            error: err.message,
        });
    }
}
