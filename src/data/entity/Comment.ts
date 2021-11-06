import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    contents: string;

    @ManyToOne(() => User, { onDelete: "SET NULL", eager: true })
    @JoinColumn({ name: "createdBy" , referencedColumnName: "id"})
    createdBy: User;

    @ManyToOne(() => Post, { onDelete: "CASCADE"})
    @JoinColumn({ name: "post" , referencedColumnName: "id"})
    post: Post;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}