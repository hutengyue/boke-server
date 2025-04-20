import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Article } from "./article.entity";
import { DateTransformer } from "../utils/dateTransform";
import { User } from "./user.entity";

@Entity("comment", { schema: "boke" })
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "commentId" })
  commentId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("int", { name: "toId", nullable: true })
  toId: number | null;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @ManyToOne(() => Article, article => article.comments)
  @JoinColumn({name:'articleId'})
  article: Article;

  @Column()
  articleId: number;

  @ManyToOne(() => User,user => user.comments)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Comment, comment => comment.replies)
  @JoinColumn({ name: 'toId' })
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];
}
