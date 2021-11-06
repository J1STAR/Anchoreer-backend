import { AuthTokenDto, UserDto } from "../api/dto";

export interface UserService {
    signUp(user: UserDto): Promise<UserDto>;
    signIn(user: UserDto): Promise<AuthTokenDto>;
}