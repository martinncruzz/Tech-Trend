import { envs } from '../../../config';
import { ResourceType } from '..';

export const buildBaseUrl = (resourceType: ResourceType, additionalPath: string = ''): string => {
  return `${envs.BACKEND_URL}/${resourceType}${additionalPath}`;
};
