import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";
import { DateTransformer } from "../utils/dateTransform";

@Entity("category", { schema: "boke" })
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "categoryId" })
  categoryId: number;

  @Column("varchar", { name: "categoryName", length: 255 })
  categoryName: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @OneToMany(() => Article, article => article.category)
  articles: Article[];

}
