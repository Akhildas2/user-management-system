import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  path.join(__dirname, '../uploads')); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Append a timestamp to the original file name
    },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject non-image files-+
        console.error('Invalid file type. Only images are allowed.');
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
});

export default upload;
