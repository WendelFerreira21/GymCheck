import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash as bcryptHash, genSalt } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {

    beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository)
    })

  it("should be able to authenticate", async () => {

   const salt = await genSalt(6)
   
   await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await bcryptHash("123456", salt),
    })

    const { user } = await sut.execute({
      email: "john@example.com",
      password: "123456",
    })

    expect (user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
   
    await expect(() =>
      sut.execute({
        email: "wrong@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(Error); 
  });

   it("should not be able to authenticate with wrong password", async () => {

    await expect(() =>
      sut.execute({
        email: "wrong@example.com",
        password: "129876",
      })
    ).rejects.toBeInstanceOf(Error); 
  });
  
})
