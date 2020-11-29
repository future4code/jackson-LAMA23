import { BaseError } from "./BaseError";

export class CustomError extends BaseError {
    constructor(
        message: string,
        code: number
    ) {
        super(message, code)
    }
}