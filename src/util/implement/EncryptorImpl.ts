import { injectable } from "inversify";
import * as crypto from 'crypto';

import { Encryptor } from "..";

@injectable()
export default class EncryptorImpl implements Encryptor {

    constructor() {}

    getRandomValue(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    encrypt(message: string, salt: string): string {
        return crypto.createHmac('sha256', salt).update(message).digest('hex');
    }
    
}