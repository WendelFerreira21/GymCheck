import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-checkins-repository.js"
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.js"
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.js"
import { SearchGymsUseCase } from "./search-gyms.js"
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.js"

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe("Fecth nearby Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it("should be able to fecth nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.2092852,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -27.8610928,
      longitude: -49.5229581,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092852,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
    ])
  })
})