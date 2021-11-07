import { injectable } from "inversify";
import { PostRepository } from "..";
import { Post } from "../../entity/Post";

import { connection } from "../../connection/Connection";
import { Like } from "typeorm";

@injectable()
export default class PostRepositoryImpl implements PostRepository {

    async save(post: Post): Promise<Post> {
        const postRepo = (await connection).getRepository(Post);
        return await postRepo.save(post);
    }

    async findById(id: number): Promise<Post> {
        const postRepo = (await connection).getRepository(Post);
        return await postRepo.findOne({where: {id: id}});
    }

    async findAll(): Promise<Post[]> {
        const postRepo = (await connection).getRepository(Post);
        return await postRepo.find({order: { createdAt: "DESC"}});
    }

    async findAllPageable(page: number, size: number): Promise<Post[]> {
        const postRepo = (await connection).getRepository(Post);
        return await postRepo.find({order: { createdAt: "DESC"}, skip: (page - 1) * size, take: size});
    }

    async findByUserName(userName: string): Promise<Post[]> {
        const postRepo = (await connection).getRepository(Post);
        let posts = await postRepo.find({relations: ["createdBy"], where: {createdBy: {userName: userName}}, order: {createdAt: "DESC"}});
        return posts;
    }

    async findByTitle(title: string): Promise<Post[]> {
        const postRepo = (await connection).getRepository(Post);
        let posts = await postRepo.find({where: {title: Like('%' + title + '%')}, order: {createdAt: "DESC"}});
        return posts;
    }

}