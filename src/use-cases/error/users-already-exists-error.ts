export class UsersAlreadyExistsError extends Error {
    constructor() {
        super("User with this email already exists.");
    }
}