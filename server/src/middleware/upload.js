import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFiles = upload.array('files');
export const uploadFile = upload.single('file');
