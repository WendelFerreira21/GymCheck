import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository.js"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history.js"
import { GetUserProfileUseCase } from "../get-user-profile.js"

export function makefetchUserCheckInsHistoryUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

    return useCase
}