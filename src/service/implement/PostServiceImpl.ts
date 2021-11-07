import { inject, injectable } from "inversify";
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
        if(post.title === null || post.title === undefined || post.title === "") throw PostError.NO_TITLE;
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

    async getPostWithAllCommentsByPostId(postId: number): Promise<PostDto> {
        if(isNaN(postId)) throw PostError.NO_POST;
        let findedPost = await this.postRepository.findById(postId);
        if(findedPost) {
            let post = this.postMapper.convert(findedPost);
            let comments = await this.commentRepository.findByPostId(postId);
            post.comments = comments.map(comment => this.commentMapper.convert(comment));
            return post;
        } else {
            throw PostError.NO_POST;
        }
    }

    async getPosts(page: number, size: number, sort: string): Promise<PostDto[]> {

        let orderByOption = this.getPostOrderByOption(sort);

        let posts;

        if(!isNaN(page) && !isNaN(size)) {
            if(page == 0) page = 1;
            posts = await this.postRepository.findAllPageableOrderby(page, size, orderByOption)
        } else {
            posts = await this.postRepository.findAllOrderBy(orderByOption);
        }
        return posts.map(post => this.postMapper.convert(post));
    }

    async getPostsByUserName(userName: string, sort: string): Promise<PostDto[]> {
        let orderByOption = this.getPostOrderByOption(sort);
        let posts = await this.postRepository.findByUserName(userName, orderByOption);
        return posts.map(post => this.postMapper.convert(post));
    }

    async getPostsByTitle(title: string, sort: string): Promise<PostDto[]> {
        let orderByOption = this.getPostOrderByOption(sort);
        let posts = await this.postRepository.findByTitle(title, orderByOption);
        return posts.map(post => this.postMapper.convert(post));
    }

    async createComment(user: UserDto, postId: number, comment: CommentDto): Promise<CommentDto> {
        if(isNaN(postId)) throw PostError.NO_POST;
        if(comment.contents === null || comment.contents === undefined || comment.contents === "") throw PostError.INVALID_COMMENT;

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
        if(comment.contents === null || comment.contents === undefined || comment.contents === "") throw PostError.INVALID_COMMENT;

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

    async deleteComment(commentId: number): Promise<void> {
        if(isNaN(commentId)) throw PostError.INVALID_COMMENT_ID;

        this.commentRepository.deleteById(commentId);
    }

    private getPostOrderByOption(sort: string) {
        let orderByOption;

        switch(sort) {
            case "createdAt,asc":
                orderByOption = { createdAt: "ASC"}
                break;
            case "createdAt,desc":
                orderByOption = { createdAt: "DESC"}
                break;
            case "updatedAt,asc":
                orderByOption = { updatedAt: "ASC"}
                break;
            case "updatedAt,desc":
                orderByOption = { updatedAt: "DESC"}
                break;
            default:
                orderByOption = { createdAt: "DESC"}
                break;
        }

        return orderByOption;
    }
}