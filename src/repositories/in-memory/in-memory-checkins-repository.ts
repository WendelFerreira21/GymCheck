import { randomUUID } from 'node:crypto'
import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository} from '../check-ins-repository.js'
import type { Prisma, User } from "@prisma/client";
import dayjs from 'dayjs'
import type { CheckInCreateInput } from '../check-in-create-input.js';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }
  
  async findyByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find((checkIn) => {
      return (
        checkIn.user_id === userId &&
        dayjs(checkIn.createdAt).isSame(date, 'day')
      )
    })

    return checkInOnSameDate ?? null
  }

  async findyByManyByUserId(userId: string, page: number) {
    return this.items
     .filter((items) => items.user_id === userId)
     .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async create({ userId, gymId }: CheckInCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: userId,
      gym_id: gymId,
      createdAt: new Date(),
      validation_at: null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}

