import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(), // Хранение в памяти как Buffer
    limits: { fileSize: 10 * 1024 * 1024 }, // Лимит 10MB
});

export const uploadFiles = upload.array('files');
