import { inject, injectable } from "inversify";
import { PostService } from "..";
import { UserDto, PostDto } from "../../api/dto";
import { PostMapper } from "../../data/mapper/ModelMapper";
import { PostRepository, UserRepository } from "../../data/repository";
import { UserError } from "../../error";

@injectable()
export default class PostServiceImpl implements PostService {

    private postMapper: PostMapper;
    private postRepository: PostRepository;
    private userRepository: UserRepository;

    constructor(
        @inject("PostMapper") postMapper: PostMapper,
        @inject("PostRepository") postRepository: PostRepository,
        @inject("UserRepository") userRepository: UserRepository
    ) {
        this.postMapper = postMapper;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    async createPost(user: UserDto, post: PostDto): Promise<PostDto> {
        let findedUser = await this.userRepository.findByEmail(user.email);
        if(findedUser) {
            let postToSave = this.postMapper.revert(post);
            postToSave.createdAt = new Date();
            postToSave.createdBy = findedUser;
            
            let savedPost = await this.postRepository.save(postToSave);
            return this.postMapper.convert(savedPost);
        } else {
            throw UserError.INVALID_USER;
        }
    }

    
}