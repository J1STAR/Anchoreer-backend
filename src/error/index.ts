export enum ErrorType {
    TYPE_USER = 0x01 << 8,
    TYPE_CLIENT = 0x02 << 8,
    TYPE_AUTH = 0x03 << 8,

    TYPE_SYSTEM = 0xff << 8
}

export class CustomError extends Error{
    status: number;
    code: number;

    constructor(status: number, code: number, message: string) {
        super();
        this.status = status;
        this.code = code;
        this.message = message;
    }
}

export class UserError {
    static ALREADY_EXIST_EMAIL = new CustomError(403, ErrorType.TYPE_USER | 0x01, "Already Exist Email");
    static INVALID_EMAIL = new CustomError(400, ErrorType.TYPE_USER | 0x02, "Invalid Email");
    static INVALID_PASSWORD = new CustomError(400, ErrorType.TYPE_USER | 0x03, "Invalid Password");
}

export class ClientError {
    static NO_TOKEN = new CustomError(400, ErrorType.TYPE_CLIENT | 0x01, "No Token");
}