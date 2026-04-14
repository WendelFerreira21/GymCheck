import { compare } from "bcryptjs";
import type { UsersRepository } from "../repositories/users-repository.js";
import { InvalidCredentialsError } from "./error/invalid-credentials-error.js";
import type { User } from "@prisma/client";
import { ResourceNotFoundError } from "./error/resource-not-found.js";

interface GetUserProfileUseCaseRequest {
    userId: string;
}

interface GetUserProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
           throw new ResourceNotFoundError
        }

        return {
            user,
        }
    }
}