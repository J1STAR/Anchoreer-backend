import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn} from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @CreateDateColumn()
    createdAt: Date;
}