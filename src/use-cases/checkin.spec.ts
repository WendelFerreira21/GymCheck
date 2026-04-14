import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./checkin.js";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-checkins-repository.js";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./error/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-Ins-error.js";

let CheckInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Checkin Use Case", () => {

  beforeEach(async () => {
    CheckInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(CheckInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
     title: 'JavaScript Gym',
     description: '',
     phone: '',
     latitude: -27.2092852,
     longitude: -49.6401891,
    })


    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it("should be able to Checkin", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect (checkIn.id).toEqual(expect.any(String));
  });
  

  it("should not be able to Checkin twice in the same day", async () => {
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to Checkin twice but in diferent days", async () => {
    
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0)) // 20 January 2024
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0)) // 21 January 2024
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect (checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to Checkin in on distance gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    await expect(() =>
    sut.execute({
     gymId: "gym-02",
     userId: "user-01",
     userLatitude: -27.209,
     userLongitude: -49.700,
    })
    ).rejects.toBeInstanceOf(MaxDistanceError)

  });
  
})
