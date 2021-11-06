import { inject, injectable } from "inversify";
import { isExternalModuleNameRelative } from "typescript";
import { PostService } from "..";
import { UserDto, PostDto, CommentDto } from "../../api/dto";
import { Comment } from "../../data/entity/Comment";
import { CommentMapper, PostMapper } from "../../data/mapper/ModelMapper";
import { CommentRepository, PostRepository, UserRepository } from "../../data/repository";
import { PostError, UserError } from "../../error";

@injectable()
export default class PostServiceImpl implements PostService {

    private postMapper: PostMapper;
    private postRepository: PostRepository;
    private userRepository: UserRepository;
    private commentMapper: CommentMapper;
    private commentRepository: CommentRepository;

    constructor(
        @inject("PostMapper") postMapper: PostMapper,
        @inject("PostRepository") postRepository: PostRepository,
        @inject("UserRepository") userRepository: UserRepository,
        @inject("CommentMapper") commentMapper: CommentMapper,
        @inject("CommentRepository") commentRepository: CommentRepository
    ) {
        this.postMapper = postMapper;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
        this.commentRepository = commentRepository;
    }

    async createPost(user: UserDto, post: PostDto): Promise<PostDto> {
        let findedUser = await this.userRepository.findById(user.id);
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

    async createComment(user: UserDto, postId: number, comment: CommentDto): Promise<CommentDto> {
        if(isNaN(postId)) throw PostError.NO_POST;

        let findedUser = await this.userRepository.findById(user.id);
        if(findedUser) {
            let findedPost = await this.postRepository.findById(postId);
            if (findedPost) {
                let commentToSave: Comment = this.commentMapper.revert(comment);
                commentToSave.createdAt = new Date();
                commentToSave.createdBy = findedUser;
                commentToSave.post = findedPost;

                let savedComment = await this.commentRepository.save(commentToSave);
                return this.commentMapper.convert(savedComment);
            } else {
                throw PostError.NO_POST;
            }
        } else {
            throw UserError.INVALID_USER;
        }
    }

    async updateComment(comment: CommentDto): Promise<CommentDto> {
        if(isNaN(comment.id)) throw PostError.NO_COMMENT;

        let findedComment = await this.commentRepository.findById(comment.id);
        if(findedComment) {
            findedComment.contents = comment.contents;
            findedComment.updatedAt = new Date();

            let updatedComment = await this.commentRepository.save(findedComment);
            return this.commentMapper.convert(updatedComment);
        } else {
            throw PostError.NO_COMMENT;
        }
    }
}