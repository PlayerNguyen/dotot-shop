"use strict";
const sharp = require("sharp");
const blurHash = require("blurhash");

// eslint-disable-next-line valid-jsdoc
/**
 * Convert to png file from a file buffer
 *
 * @param {Buffer} buffer a buffer to sanitize
 * @return {import("sharp").Sharp} sharp
 */
function convertToPng(buffer) {
  return (
    sharp(buffer)
      // Load as png stream
      .png({
        quality: 50,
        compressionLevel: 8,
        effort: 1,
      })
  );
}

/**
 *
 * @param {Buffer} buffer a buffer to blur an image
 * @return {Promise<String>} a promise resolve blur hashed
 */
function generateBlurHash(buffer) {
  return new Promise((res, rej) => {
    sharp(buffer)
      .resize(32, 32, { fit: "inside" })
      .raw()
      .ensureAlpha()
      .toBuffer((err, buffer, { width, height }) => {
        if (err) rej(err);
        res(
          blurHash.encode(new Uint8ClampedArray(buffer), width, height, 4, 4),
        );
      });
  });
}

module.exports = {
  convertToPng,
  generateBlurHash,
};
