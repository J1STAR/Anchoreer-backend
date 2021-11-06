import {Entity, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn} from "typeorm";
import * as crypto from 'crypto';
import { User } from "./User";

@Entity()
export class AuthToken {

    @PrimaryColumn({nullable: false})
    token: string;

    @ManyToOne(() => User, {onDelete: 'CASCADE', eager: true})
    @JoinColumn([{ name: 'user', referencedColumnName: 'id'}])
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    constructor(user: User) {
        let randomValue = crypto.randomBytes(32).toString('hex');
        let salt = new Date().getTime().toString();
        let token = crypto.createHmac('sha256', salt).update(randomValue).digest('hex')

        this.token = token;
        this.user = user;
        this.createdAt = new Date();
    }
}