import { BadRequestException } from '@nestjs/common';

export function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  const fileExtension = file.mimetype.split('/').at(1) || '';
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  if (validExtensions.includes(fileExtension)) return callback(null, true);

  callback(new BadRequestException(`Invalid file, use these formats [${validExtensions}]`), false);
}
