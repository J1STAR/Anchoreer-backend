import * as express from 'express';
import { Request, Response } from 'express';
import container from '../../injector';
import { PostService, UserService } from '../../service';
import { RequestManager } from '../../util';
import { PostDto, UserDto } from '../dto';

class PostController {

    public router = express.Router();
    
    private requestManager: RequestManager;
    private postService: PostService;
    private userService: UserService;
 
    constructor(
        requestManager: RequestManager,
        postService: PostService,
        userService: UserService
    ) {
        this.requestManager = requestManager;
        this.postService = postService;
        this.userService = userService;

        this.router.post('', async (req: Request, res: Response, next) => {

            let post: PostDto = req.body;

            try {
                let token = await this.requestManager.getToken(req);
                let requester = await this.userService.getUserByToken(token);
                let savedPost = await this.postService.createPost(requester, post);

                res.status(201).send(savedPost);
            } catch (err) {
                next(err);
            }
        })

        this.router.post('/:postId/comments', async (req: Request, res: Response, next) => {
            try {
                let comment = req.body;

                let postId: number = Number(req.params.postId);
                let token = await this.requestManager.getToken(req);
                let requester = await this.userService.getUserByToken(token);
                let savedComment = await this.postService.createComment(requester, postId, comment);

                res.status(201).send(savedComment);
            } catch (err) {
                next(err);
            }
        })

        this.router.put('/comments', async (req: Request, res: Response, next) => {
            try {
                let comment = req.body;
                let updatedComment = await this.postService.updateComment(comment);
                res.status(200).send(updatedComment);
            } catch (err) {
                next(err);
            }
        })

        this.router.delete('/comments/:commentId', async (req: Request, res: Response, next) => {
            try {
                let commentId = Number(req.params.commentId);
                await this.postService.deleteComment(commentId);
                res.status(204).send();
            } catch (err) {
                next(err);
            }
        })
    }
 }
 
 export const postController = new PostController(container.get("RequestManager"), container.get("PostService"), container.get("UserService")).router;