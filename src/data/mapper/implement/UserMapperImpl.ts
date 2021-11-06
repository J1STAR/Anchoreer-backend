import { injectable } from "inversify";
import { UserDto } from "../../../api/dto";
import { User } from "../../entity/User";
import { UserMapper } from "../ModelMapper";

@injectable()
export default class UserMapperImpl implements UserMapper {

    convert(entity: User): UserDto {
        let dto = new UserDto();

        dto.id = entity.id;
        dto.email = entity.email;
        dto.userName = entity.userName;
        dto.createdAt = entity.createdAt;

        return dto;
    }

    revert(dto: UserDto): User {
        let entity = new User();

        entity.id = dto.id;
        entity.email = dto.email;
        entity.userName = dto.userName;
        entity.createdAt = dto.createdAt;

        return entity;
    }
}