import { envs } from '@config/adapters/envs.adapter';
import { ResourceType } from '@modules/shared/interfaces/enums';

export function buildBaseUrl(resourceType: ResourceType, additionalPath: string = ''): string {
  return `${envs.API_BASE_URL}/${resourceType}${additionalPath}`;
}
