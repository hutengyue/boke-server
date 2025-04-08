import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity("gmessage", { schema: "boke" })
export class Gmessage {
  @PrimaryGeneratedColumn({ type: "int", name: "gmessageId" })
  groupId: number;

  @ManyToOne(() => User, user => user.gmessages)
  @JoinColumn({name:'userId'})
  user: User;

  @Column("int")
  userId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;
}
