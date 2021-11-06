import { injectable } from "inversify";
import { AuthTokenRepository } from "..";

import { connection } from "../../connection/Connection";
import { AuthToken } from "../../entity/AuthToken";

@injectable()
export default class AuthTokenRepositoryImpl implements AuthTokenRepository {

    async findById(token: string): Promise<AuthToken> {
        const authTokenRepo = (await connection).getRepository(AuthToken);
        
        return await authTokenRepo.findOne(token);
    }

    async save(authToken: AuthToken): Promise<AuthToken> {
        const authTokenRepo = (await connection).getRepository(AuthToken);
        
        return await authTokenRepo.save(authToken);
    }

}