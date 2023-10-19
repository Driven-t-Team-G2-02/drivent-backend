import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { string } from "joi";
const prisma = new PrismaClient();

async function createTicketTypes() {
  await createTicketType(true, true, "Presencial + Com Hotel");
  await createTicketType(true, false, "Presencial + Sem Hotel");
  await createTicketType(false, false, "Online");
}

async function createTicketType(isRemote: boolean, includesHotel: boolean, name: string) {
  return prisma.ticketType.create({
    data: {
      name: name,
      price: calculatePrice(isRemote, includesHotel),
      isRemote: isRemote,
      includesHotel: includesHotel,
    },
  });
}

function calculatePrice(isRemote:boolean, includesHotel:boolean) {
 
  if (isRemote) {
    if (includesHotel) {
      return 600; // Preço para ingresso presencial com hotel
    } else {
      return 250; // Preço para ingresso presencial sem hotel
    }
  } else {
    return 100; // Preço para ingresso online
  }
}

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

  await createTicketTypes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
