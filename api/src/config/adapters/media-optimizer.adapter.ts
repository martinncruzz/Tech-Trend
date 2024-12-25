import * as sharp from 'sharp';

export class MediaOptimizerAdapter {
  static optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    return sharp(file.buffer).webp().toBuffer();
  }
}
