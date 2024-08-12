const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View Credentials' below to copy your API secret
});

module.exports = cloudinary;
