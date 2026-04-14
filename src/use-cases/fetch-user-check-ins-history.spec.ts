import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-checkins-repository.js"
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.js"

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe("Checkin Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it("should be able to fetch user check-ins history", async () => {
    await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    })

    await checkInsRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    })

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ])
  })

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i}`,
        userId: "user-01",
      })
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ])
  })
})

