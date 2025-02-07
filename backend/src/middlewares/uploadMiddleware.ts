import multer from 'multer';

// Use memory storage for storing files in buffer
const storage = multer.memoryStorage();

// File filter function to allow only image files
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only images are allowed.')); // Reject non-image files
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 3MB size limit
});

export default upload;

