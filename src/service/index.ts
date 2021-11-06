import { UserDto } from "../api/dto";

export interface UserService {
    signUp(user: UserDto): Promise<UserDto>;
}