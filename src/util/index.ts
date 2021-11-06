import { Request } from 'express';

export interface Validator {
    isEmail(email: string): boolean;
}

export interface Encryptor {
    getRandomValue(): string;
    encrypt(message: string, salt: string): string;
}

export interface RequestManager {
    getToken(req: Request): Promise<string>;
}