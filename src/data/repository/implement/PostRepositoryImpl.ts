import { injectable } from "inversify";
import { PostRepository } from "..";
import { Post } from "../../entity/Post";

import { connection } from "../../connection/Connection";

@injectable()
export default class PostRepositoryImpl implements PostRepository {

    async save(post: Post): Promise<Post> {
        const postRepo = (await connection).getRepository(Post);
        
        return await postRepo.save(post);
    }

}