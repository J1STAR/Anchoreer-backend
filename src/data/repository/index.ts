import { AuthToken } from "../entity/AuthToken";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";

export interface UserRepository {
    existsByEmail(email: string): Promise<boolean>;
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findById(id: number): Promise<User>;
}

export interface AuthTokenRepository {
    save(authToken: AuthToken): Promise<AuthToken>;
    findById(token: string): Promise<AuthToken>;
}

export interface PostRepository {
    save(post: Post): Promise<Post>;
    findById(id: number): Promise<Post>;
}

export interface CommentRepository {
    save(comment: Comment): Promise<Comment>;
    findById(id: number): Promise<Comment>;
}