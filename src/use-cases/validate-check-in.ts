import type { CheckIn, User } from '@prisma/client'
import type { CheckInsRepository } from '../repositories/check-ins-repository.js'
import { ResourceNotFoundError } from './error/resource-not-found.js'
import { LateCheckInValidationError } from './error/late-checkin-validation-error.js'
import dayjs from 'dayjs'

interface ValidateCheckInUseCaseRequest {
  checkinId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    checkinId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkinId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
     checkIn.createdAt,
     'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
     throw new LateCheckInValidationError()
    }  


   checkIn.validation_at = new Date()

   await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
