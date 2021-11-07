import * as express from 'express';
import { Request, Response } from 'express';
import container from '../../injector';

import { UserService } from '../../service';
import { UserDto } from '../dto';

class UserController {

    public router = express.Router();
    private userService: UserService;
 
    constructor(
        userService: UserService
    ) {
        this.userService = userService;

        this.router.post('/sign-up', async (req: Request, res: Response, next) => {

            try {
                let user: UserDto = req.body;

                let signedUpUser = await this.userService.signUp(user);
                res.status(201).send(signedUpUser);
            } catch (err) {
                next(err);
            }
        })

        this.router.post('/sign-in', async (req: Request, res: Response, next) => {

            try {
                let user: UserDto = req.body;
                let token = await this.userService.signIn(user);
                res.status(200).send(token);
            } catch (err) {
                next(err);
            }
        })

    }
 }
 
 export const userController = new UserController(container.get("UserService")).router;