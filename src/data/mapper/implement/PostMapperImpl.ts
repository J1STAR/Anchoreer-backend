import { inject, injectable } from "inversify";
import { PostDto } from "../../../api/dto";
import { Post } from "../../entity/Post";
import { PostMapper, UserMapper } from "../ModelMapper";

@injectable()
export default class PostMapperImpl implements PostMapper {

    private userMapper: UserMapper;

    constructor(
        @inject("UserMapper") userMapper: UserMapper
    ) {
        this.userMapper = userMapper;
    }

    convert(entity: Post): PostDto {
        let dto = new PostDto();
        
        dto.id = entity.id;
        dto.title = entity.title;
        dto.contents = entity.contents;
        dto.updatedAt = entity.updatedAt;
        dto.createdAt = entity.createdAt;
        dto.createdBy = this.userMapper.convert(entity.createdBy);

        return dto;
    }
    
    revert(dto: PostDto): Post {
        let entity = new Post();

        entity.title = dto.title;
        entity.contents = dto.contents;

        return entity;
    }

}