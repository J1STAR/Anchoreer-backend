import { createConnection, Connection } from "typeorm";
import { AuthToken } from "../entity/AuthToken";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";

import { User } from "../entity/User";

export const connection: Promise<Connection> = createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "jasoseol_zunkyu",
    entities: [User, AuthToken, Post, Comment],
    logging: false,
    synchronize: true
});