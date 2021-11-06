import { inject, injectable } from "inversify";
import { Comment } from "../../entity/Comment";
import { CommentDto } from "../../../api/dto";
import { CommentMapper, UserMapper } from "../ModelMapper";

@injectable()
export default class CommentMapperImpl implements CommentMapper {

    private userMapper: UserMapper;

    constructor(
        @inject("UserMapper") userMapper: UserMapper
    ) {
        this.userMapper = userMapper;
    }

    convert(entity: Comment): CommentDto {
        let dto = new CommentDto();
        dto.id = entity.id;
        dto.contents = entity.contents;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.createdBy = this.userMapper.convert(entity.createdBy);
        return dto;
    }

    revert(dto: CommentDto): Comment {
        let entity = new Comment();
        entity.contents = dto.contents;
        return entity;
    }

}