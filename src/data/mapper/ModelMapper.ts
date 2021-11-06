import { BaseMapper } from "./BaseMapper";

import { AuthTokenDto, CommentDto, PostDto, UserDto } from "../../api/dto";

import { User } from "../entity/User";
import { AuthToken } from "../entity/AuthToken";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";

export interface UserMapper extends BaseMapper<User, UserDto> {}
export interface AuthTokenMapper extends BaseMapper<AuthToken, AuthTokenDto> {}
export interface PostMapper extends BaseMapper<Post, PostDto> {}
export interface CommentMapper extends BaseMapper<Comment, CommentDto> {}