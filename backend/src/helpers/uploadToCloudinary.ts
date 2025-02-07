import cloudinary from '../config/cloudinaryConfig';

// Upload Image to Cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "profile-images", resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};