import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-checkins-repository.js"
import { GetUserMetricsUseCase } from "./get-user-metrics.js"

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe("Checkin Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it("should be able to get checkins count from metrics", async () => {

    await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    })

    await checkInsRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    })

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    })

    expect(checkInsCount).toEqual(2)
  })
})

