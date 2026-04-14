import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.js";
import { UsersAlreadyExistsError } from "./error/users-already-exists-error.js";

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository)
  })

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    })

    expect (user.id).toEqual(expect.any(String));
  });
  
  it("should hash user password upon registration", async () => {

    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    })

    const PasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    )

   expect(PasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
   
    const email = "john@example.com"

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    })

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UsersAlreadyExistsError);
  });
})

