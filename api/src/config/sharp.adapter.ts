import * as sharp from 'sharp';

export class SharpAdapter {
  static async optimizeImage(file: Express.Multer.File) {
    return await sharp(file.buffer).webp().toBuffer();
  }
}
