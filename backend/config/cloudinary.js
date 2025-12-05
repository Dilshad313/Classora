import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
const config = cloudinary.config();

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error('❌ Cloudinary Configuration Error:');
  console.error('Missing environment variables. Please check your .env file:');
  console.error(`CLOUDINARY_CLOUD_NAME: ${config.cloud_name ? '✓' : '✗ MISSING'}`);
  console.error(`CLOUDINARY_API_KEY: ${config.api_key ? '✓' : '✗ MISSING'}`);
  console.error(`CLOUDINARY_API_SECRET: ${config.api_secret ? '✓' : '✗ MISSING'}`);
} else {
  console.log('✅ Cloudinary configured successfully');
  console.log(`📦 Cloud Name: ${config.cloud_name}`);
}

export default cloudinary;