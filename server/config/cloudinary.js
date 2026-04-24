import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhxt9swpg',
  api_key: process.env.CLOUDINARY_API_KEY || '793951369521343',
  api_secret: process.env.CLOUDINARY_API_SECRET || '74gYsIAW4zF9p8sVdS4LhD_CHGA'
});

export default cloudinary;
