import { Blog } from "src/blogs/blog.entity";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comment{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @ManyToOne(() => Blog, (blog) => blog.comments)
    @JoinColumn({ name: 'blog_id' })
    blog: Blog;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;

}