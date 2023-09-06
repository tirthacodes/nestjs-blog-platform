import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Blog } from "src/blogs/blog.entity";
import { Comment } from "src/blogs/comments/comments-entities/comment.entity";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    username: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column()
    @Exclude()
    salt: string;

    async validatePassword(password: string){
        return bcrypt.compare(password, this.password);
    }

    @OneToMany(() => Blog, (blog) => blog.user)
    blogs: Blog[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}