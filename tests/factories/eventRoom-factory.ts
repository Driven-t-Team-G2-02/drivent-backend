import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export function createEventRoom(eventId: number) {
  return prisma.eventRoom.create({
    data: {
      name: faker.name.firstName(),
      eventId,
    },
  });
}
