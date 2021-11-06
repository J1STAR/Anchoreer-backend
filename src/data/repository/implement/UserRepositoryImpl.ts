import { injectable } from "inversify";
import { UserRepository } from "..";

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
        
        return await userRepo.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        const userRepo = (await connection).getRepository(User);
        return await userRepo.findOne({where: {email: email}});
    }

}