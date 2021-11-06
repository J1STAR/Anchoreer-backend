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

        this.router.post('/sign-up', (req: Request, res: Response, next) => {

            let user: UserDto = req.body;

            this.userService.signUp(user)
            .then(user => {
                res.status(201).send(user);
            }).catch(err => {
                next(err);
            });
        })

        this.router.post('/sign-in', (req: Request, res: Response, next) => {

            let user: UserDto = req.body;

            this.userService.signIn(user)
            .then(token => {
                res.status(200).send(token);
            }).catch(err => {
                next(err);
            })
        })

    }
 }
 
 export const userController = new UserController(container.get("UserService")).router;