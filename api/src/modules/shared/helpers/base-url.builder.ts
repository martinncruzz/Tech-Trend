import { envs } from '../../../config';
import { ResourceType } from '..';

export function buildBaseUrl(resourceType: ResourceType, additionalPath: string = ''): string {
  return `${envs.BACKEND_URL}/${resourceType}${additionalPath}`;
}
