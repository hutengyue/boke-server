import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import {Category} from "./category.entity";
import {User} from "./user.entity";

@Entity("message", { schema: "boke" })
export class Message {
  @PrimaryGeneratedColumn({ type: "int", name: "messageId" })
  messageId: number;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({name:'userId'})
  user: User;

  @Column()
  userId: number;

  @Column("varchar", { name: "content", length: 255 })
  content: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

}
