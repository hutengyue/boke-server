import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { Article } from "./article.entity";

@Entity("tag", { schema: "boke" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "tagId" })
  tagId: number;

  @Column("varchar", { name: "tagName", length: 255 })
  tagName: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @ManyToMany(() => Article, article => article.tags)
  @JoinTable({
    name: 'tags_articles',
    joinColumn: {
      name: 'tagId',
      referencedColumnName: 'tagId'
    },
    inverseJoinColumn: {
      name: 'articleId',
      referencedColumnName: 'articleId'
    }
  })
  articles: Article[];

}
