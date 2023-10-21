import { activitiesRepository } from '@/repositories';

export async function getActivities() {
  return await activitiesRepository.findActivities();
}

export const activitiesService = {
  getActivities,
};
