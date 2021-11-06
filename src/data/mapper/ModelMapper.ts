import { BaseMapper } from "./BaseMapper";

import { AuthTokenDto, UserDto } from "../../api/dto";

import { User } from "../entity/User";
import { AuthToken } from "../entity/AuthToken";

export interface UserMapper extends BaseMapper<User, UserDto> {}
export interface AuthTokenMapper extends BaseMapper<AuthToken, AuthTokenDto> {}