import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Comment } from "./comments/comments-entities/comment.entity";

@Entity({ name: 'blogs' })
export class Blog{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsNotEmpty()
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(()=> User, (user) => user.blogs)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @OneToMany(() => Comment, (comment) => comment.blog)
    comments: Comment[];
}