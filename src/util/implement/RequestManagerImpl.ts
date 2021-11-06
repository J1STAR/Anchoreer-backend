import { Request } from "express";
import { injectable } from "inversify";
import { RequestManager } from "..";
import { AuthError } from "../../error";

@injectable()
export default class RequestManagerImpl implements RequestManager {

    async getToken(req: Request): Promise<string> {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else {
            throw AuthError.NO_TOKEN;
        }
    }
}