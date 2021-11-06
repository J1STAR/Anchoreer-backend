import * as Dto from "../api/dto";

export interface UserService {
    signUp(user: Dto.UserDto): Promise<Dto.UserDto>;
    signIn(user: Dto.UserDto): Promise<Dto.AuthTokenDto>;
    getUserByToken(token: string): Promise<Dto.UserDto>;
}

export interface PostService {
    createPost(user: Dto.UserDto, post: Dto.PostDto): Promise<Dto.PostDto>;
}