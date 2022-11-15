const multer = require("multer");

/**
 * memoryUploadMiddleware is an instance of a
 * multer middleware using memory storage used for upload a
 * file from multipart/form-data into memory (RAM) of node server
 * @type {multer.Multer}
 */
const memoryUploadMiddleware = multer({ storage: multer.memoryStorage() });

module.exports = memoryUploadMiddleware;
