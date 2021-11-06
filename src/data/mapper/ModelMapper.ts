import { BaseMapper } from "./BaseMapper";

import { AuthTokenDto, PostDto, UserDto } from "../../api/dto";

import { User } from "../entity/User";
import { AuthToken } from "../entity/AuthToken";
import { Post } from "../entity/Post";

export interface UserMapper extends BaseMapper<User, UserDto> {}
export interface AuthTokenMapper extends BaseMapper<AuthToken, AuthTokenDto> {}
export interface PostMapper extends BaseMapper<Post, PostDto> {}