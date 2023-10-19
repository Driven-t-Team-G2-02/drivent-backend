import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const activities = await activitiesService.getActivities();
  res.status(httpStatus.OK).send(activities);
}