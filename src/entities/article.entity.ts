import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Category } from "./category.entity";
import { Comment } from "./comment.entity";
import { DateTransformer } from "../utils/dateTransform";
import { Tag } from "./tag.entity";

@Entity("article", { schema: "boke" })
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "articleId" })
  articleId: number;

  @Column("varchar", { name: "articleTitle", length: 255 })
  articleTitle: string;

  @Column("varchar", { name: "articleLabel", length: 255 })
  articleLabel: string;

  @Column("varchar", { name: "articleMessage", length: 255 })
  articleMessage: string;

  @Column("varchar", { name: "articleImg", length: 255 })
  articleImg: string;

  @Column("int", { name: "heat" })
  heat: number;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @ManyToOne(() => Category, category => category.articles)
  @JoinColumn({name:'categoryId'})
  category: Category;

  @Column()
  categoryId: number;

  @ManyToMany(() => Tag, tag => tag.articles)
  tags: Tag[];

}
