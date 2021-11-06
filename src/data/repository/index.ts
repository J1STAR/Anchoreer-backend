import { User } from "../entity/User";

export interface UserRepository {
    existsByEmail(email: string): Promise<boolean>;
    save(user: User): Promise<User>;
}