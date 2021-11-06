import { injectable } from "inversify";
import { CommentRepository } from "..";
import { Comment } from "../../entity/Comment";

import { connection } from "../../connection/Connection";

@injectable()
export default class CommentRepositoryImpl implements CommentRepository {

    async save(comment: Comment): Promise<Comment> {
        const commentRepo = (await connection).getRepository(Comment);
        return await commentRepo.save(comment);
    }

    async findById(id: number): Promise<Comment> {
        const commentRepo = (await connection).getRepository(Comment);
        return await commentRepo.findOne({where: {id: id}});
    }

    async deleteById(id: number): Promise<void> {
        const commentRepo = (await connection).getRepository(Comment);
        let deleteResult = await commentRepo.delete(id);
    }

}