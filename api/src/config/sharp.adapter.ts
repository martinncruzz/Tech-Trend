const sharp = require('sharp');

export class SharpAdapter {
  static async optimizeImage(file: Express.Multer.File) {
    return await sharp(file.buffer).webp().toBuffer();
  }
}
