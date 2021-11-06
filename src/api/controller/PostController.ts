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

                res.status(200).send(savedPost);
            } catch (err) {
                next(err);
            }
        })
    }
 }
 
 export const postController = new PostController(container.get("RequestManager"), container.get("PostService"), container.get("UserService")).router;