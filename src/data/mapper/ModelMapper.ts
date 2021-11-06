import { BaseMapper } from "./BaseMapper";

import { UserDto } from "../../api/dto";
import { User } from "../entity/User";

export interface UserMapper extends BaseMapper<User, UserDto> {}