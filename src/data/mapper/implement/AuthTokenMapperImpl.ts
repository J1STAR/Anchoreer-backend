import { injectable } from "inversify";
import { AuthTokenDto } from "../../../api/dto";
import { AuthToken } from "../../entity/AuthToken";
import { AuthTokenMapper } from "../ModelMapper";

@injectable()
export default class AuthTokenMapperImpl implements AuthTokenMapper {

    convert(entity: AuthToken): AuthTokenDto {
        let dto = new AuthTokenDto();

        dto.token = entity.token;

        return dto;
    }

    revert(dto: AuthTokenDto): AuthToken {
        throw new Error("Method not implemented.");
    }
}