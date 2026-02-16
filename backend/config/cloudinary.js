import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('📸 Cloudinary Configuration:');
console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('  API Key:', process.env.CLOUDINARY_API_KEY ? 'LOADED ✓' : 'MISSING ✗');
console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? 'LOADED ✓' : 'MISSING ✗');

export default cloudinary;