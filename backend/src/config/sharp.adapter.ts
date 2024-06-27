import * as sharp from 'sharp';

export class SharpAdapter {
  static optimizeImage = async (file: Express.Multer.File) =>
    await sharp(file.buffer).resize({ width: 1920 }).webp().toBuffer();
}
