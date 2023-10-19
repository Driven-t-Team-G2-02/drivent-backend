import { PrismaClient, PrismaPromise, Event } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    let event = await tx.event.findFirst();

    if (!event) {
      event = await tx.event.create({
        data: {
          title: "Driven.t",
          logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
          backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
          startsAt: dayjs().toDate(),
          endsAt: dayjs().add(21, "days").toDate(),
        }
      });
    }

    const room = await tx.room.findFirst();

    if (!room) {
      const room1 = await tx.eventRoom.create({
        data: {
          name: "Auditório Principal",
          eventId: event.id,
        }
      });

      const room2 = await tx.eventRoom.create({
        data: {
          name: "Auditório Lateral",
          eventId: event.id,
        }
      });

      const room3 = await tx.eventRoom.create({
        data: {
          name: "Sala de Workshop",
          eventId: event.id,
        }
      });

      await tx.activity.createMany({
        data: [
          // first day
          {
            name: "Minecraft: montando o PC ideal",
            capacity: 30,
            eventRoomId: room1.id,
            startsAt: dayjs().add(3, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(3, "day").add(10, "hour").toDate(),
          },
          {
            name: "Lol: montando o PC ideal",
            capacity: 30,
            eventRoomId: room1.id,
            startsAt: dayjs().add(3, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(3, "day").add(11, "hour").toDate(),
          },
          {
            name: "JS no web development",
            capacity: 50,
            eventRoomId: room2.id,
            startsAt: dayjs().add(3, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(3, "day").add(11, "hour").toDate(),
          },
          {
            name: "O Futuro do JAVA",
            capacity: 40,
            eventRoomId: room3.id,
            startsAt: dayjs().add(3, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(3, "day").add(10, "hour").toDate(),
          },
          {
            name: "JAVA vs C#",
            capacity: 40,
            eventRoomId: room3.id,
            startsAt: dayjs().add(3, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(3, "day").add(11, "hour").toDate(),
          },
          // second day
          {
            name: "Minecraft: montando o PC ideal",
            capacity: 30,
            eventRoomId: room2.id,
            startsAt: dayjs().add(4, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(4, "day").add(10, "hour").toDate(),
          },
          {
            name: "Lol: montando o PC ideal",
            capacity: 40,
            eventRoomId: room2.id,
            startsAt: dayjs().add(4, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(4, "day").add(11, "hour").toDate(),
          },
          {
            name: "JS no web development",
            capacity: 50,
            eventRoomId: room3.id,
            startsAt: dayjs().add(4, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(4, "day").add(11, "hour").toDate(),
          },
          {
            name: "O Futuro do JAVA",
            capacity: 40,
            eventRoomId: room1.id,
            startsAt: dayjs().add(4, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(4, "day").add(10, "hour").toDate(),
          },
          {
            name: "JAVA vs C#",
            capacity: 40,
            eventRoomId: room1.id,
            startsAt: dayjs().add(4, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(4, "day").add(11, "hour").toDate(),
          },
          // third day
          {
            name: "Minecraft: montando o PC ideal",
            capacity: 30,
            eventRoomId: room3.id,
            startsAt: dayjs().add(5, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(5, "day").add(10, "hour").toDate(),
          },
          {
            name: "Lol: montando o PC ideal",
            capacity: 50,
            eventRoomId: room3.id,
            startsAt: dayjs().add(5, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(5, "day").add(11, "hour").toDate(),
          },
          {
            name: "JS no web development",
            capacity: 50,
            eventRoomId: room1.id,
            startsAt: dayjs().add(5, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(5, "day").add(11, "hour").toDate(),
          },
          {
            name: "O Futuro do JAVA",
            capacity: 50,
            eventRoomId: room2.id,
            startsAt: dayjs().add(5, "day").add(9, "hour").toDate(),
            endsAt: dayjs().add(5, "day").add(10, "hour").toDate(),
          },
          {
            name: "JAVA vs C#",
            capacity: 50,
            eventRoomId: room2.id,
            startsAt: dayjs().add(5, "day").add(10, "hour").toDate(),
            endsAt: dayjs().add(5, "day").add(11, "hour").toDate(),
          },
        ]
      })
    }

    return event;
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
