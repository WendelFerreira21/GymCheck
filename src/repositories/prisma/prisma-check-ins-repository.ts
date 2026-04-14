import type { CheckIn, Prisma, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { CheckInsRepository } from "../check-ins-repository.js";
import type { CheckInCreateInput } from "../check-in-create-input.js";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
   const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn
  }

  async findyByUserIdOnDate(userId: string, date: Date) {
  const startOfTheDay = dayjs(date).startOf('date')
  const endOfTheDay = dayjs(date).endOf('date')

  const checkIn = await prisma.checkIn.findFirst({
    where: {
      user_id: userId,
      createdAt: {
        gte: startOfTheDay.toDate(),
        lte: endOfTheDay.toDate(),
      },
    },
  })

   return checkIn
  }


  async findyByManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
        where: {
            user_id: userId,
        },
        take: 20,
        skip: (page - 1) * 20,
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const checkIn = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return checkIn
  }

  async create({ userId, gymId }: CheckInCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data: {
        user_id: userId,
        gym_id: gymId,
      },
    })

    return checkIn
  }

  async save(data: CheckIn) {
    const CheckIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return CheckIn
  }
}