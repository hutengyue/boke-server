import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";
import { DateTransformer } from "../utils/dateTransform";

@Entity("comment", { schema: "boke" })
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "commentId" })
  commentId: number;

  @Column("int", { name: "articleId" })
  articleId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("int", { name: "toId", nullable: true })
  toId: number | null;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @ManyToOne(() => Article, article => article.comments)
  article: Article;
}
