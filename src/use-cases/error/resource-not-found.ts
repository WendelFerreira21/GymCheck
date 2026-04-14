export class ResourceNotFoundError extends Error {
    constructor() {
        super("Invalid resource ID.");
    }
}