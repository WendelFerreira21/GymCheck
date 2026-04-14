import type { CheckIn, Prisma } from "@prisma/client";

export interface CheckInCreateInput {
  userId: string
  gymId: string
}

export interface CheckInsRepository {
    create: (data: CheckInCreateInput) => Promise<CheckIn>;
    findById: (id: string) => Promise<CheckIn | null>;
    findyByManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>;
    countByUserId: (userId: string) => Promise<number>;
    findyByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
    save: (checkIn: CheckIn) => Promise<CheckIn>;
} 