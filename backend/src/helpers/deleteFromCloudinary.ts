import cloudinary from '../config/cloudinaryConfig';

// Delete Old Image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    const publicIdMatch = imageUrl.match(/\/([^/]+)\.[a-z]+$/i);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;
    if (publicId) {
        await cloudinary.uploader.destroy(`profile-images/${publicId}`);
    }
};