import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

export const handleDBExceptions = (error: any, logger: Logger) => {
  if (error.code === 'P2002')
    throw new BadRequestException(`Unique constraint violation in ${JSON.stringify(error.meta)}"`);

  logger.error(error);
  throw new InternalServerErrorException(`Unexpected error, check server logs`);
};
