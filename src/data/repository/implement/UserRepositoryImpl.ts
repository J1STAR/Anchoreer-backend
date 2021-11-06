import { injectable } from "inversify";
import { getManager } from "typeorm";
import { UserRepository } from "..";
import { UserError } from "../../../error";
import { connection } from "../../connection/Connection";

import { User } from "../../entity/User";

@injectable()
export default class UserRepositoryImpl implements UserRepository {

    async existsByEmail(email: string): Promise<boolean> {
        const userRepo = (await connection).getRepository(User);
        let user = await userRepo.findOne({where: {email: email}});

        if(user) {
            return true;
        } else {
            return false;
        }
    }

    async save(user: User): Promise<User> {
        const userRepo = (await connection).getRepository(User);
        
        return userRepo.save(user);
    }

}