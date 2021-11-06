import * as Dto from "../api/dto";

export interface UserService {
    signUp(user: Dto.UserDto): Promise<Dto.UserDto>;
    signIn(user: Dto.UserDto): Promise<Dto.AuthTokenDto>;
    getUserByToken(token: string): Promise<Dto.UserDto>;
}

export interface PostService {
    createPost(user: Dto.UserDto, post: Dto.PostDto): Promise<Dto.PostDto>;
    getPostWithAllCommentsByPostId(postId: number): Promise<Dto.PostDto>;
    getPosts(): Promise<Dto.PostDto[]>;
    getPostsPageable(page: number, size: number): Promise<Dto.PostDto[]>;
    createComment(user: Dto.UserDto, postId: number, comment: Dto.CommentDto): Promise<Dto.CommentDto>;
    updateComment(comment: Dto.CommentDto): Promise<Dto.CommentDto>;
    deleteComment(comentId: number): Promise<void>;
}