import 'reflect-metadata';
import * as express from 'express';

import { errorHandler, requestLogger } from './middle-ware';

import { userController } from './api/controller/UserController';
import { postController } from './api/controller/PostController';

export default class App {
    
    public server: express.Application;

    constructor(
    ) {
        this.server = express();

        this.server.use(express.json());

        this.server.use(requestLogger);

        this.server.use('/users', userController);
        this.server.use('/posts', postController);

        this.server.use(errorHandler);
    }
}