import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-checkins-repository.js";
import { ValidateCheckInUseCase } from "./validate-check-in.js";
import { ResourceNotFoundError } from "./error/resource-not-found.js";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("Validate Use Case", () => {

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);


    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it("should be able to validate Checkin", async () => {
    const createdcheckIn = await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    })
    
    await sut.execute({
      checkinId: createdcheckIn.id,
    })

    const checkInOnRepository = checkInsRepository.items.find(
      (checkIn) => checkIn.id === createdcheckIn.id,
    )

    expect(checkInOnRepository?.validation_at).toEqual(expect.any(Date))
  })

  it("should not be able to validate an inexistent Checkin", async () => {
    
    await expect(() =>
      sut.execute({
        checkinId: "inexistent-checkin-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
   vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
     gymId: 'gym-01',
     userId: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkinId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

})