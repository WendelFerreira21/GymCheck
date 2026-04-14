import { beforeEach, describe, expect, it } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.js";
import { UsersAlreadyExistsError } from "./error/users-already-exists-error.js";
import { GetUserProfileUseCase } from "./get-user-profile.js";
import { InvalidCredentialsError } from "./error/invalid-credentials-error.js";
import { ResourceNotFoundError } from "./error/resource-not-found.js";

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect (user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile with invalid user ID", async () => {
    await expect(() =>
      sut.execute({
        userId: "invalid-user-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });


})

