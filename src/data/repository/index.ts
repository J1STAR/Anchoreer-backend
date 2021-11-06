import { AuthToken } from "../entity/AuthToken";
import { User } from "../entity/User";

export interface UserRepository {
    existsByEmail(email: string): Promise<boolean>;
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User>;
}

export interface AuthTokenRepository {
    save(authToken: AuthToken): Promise<AuthToken>;
}