import type { CheckIn, User } from '@prisma/client'
import type { CheckInsRepository } from '../repositories/check-ins-repository.js'
import type { GymsRepository } from '../repositories/gyms-repository.js'
import { ResourceNotFoundError } from './error/resource-not-found.js'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinate.js'
import { MaxDistanceError } from './error/max-distance-error.js'
import { MaxNumberOfCheckInsError } from './error/max-number-of-check-Ins-error.js'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError
    }

    const checkInOnSameDate =
      await this.checkInsRepository.findyByUserIdOnDate(
        userId,
        new Date()
      )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError
    }

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    })

    return { checkIn }
  }
}
