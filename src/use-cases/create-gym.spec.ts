import { expect, describe, it, beforeEach } from "vitest"
import { CreateGymUseCase } from "./create-gym.js"
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.js"

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it("should be able to create gym", async () => {
    const {gym} = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -27.2092852,
      longitude: -49.6401091,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
