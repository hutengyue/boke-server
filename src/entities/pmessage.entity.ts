import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,ManyToOne,JoinColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { User } from "./user.entity";

@Entity("pmessage", { schema: "boke" })
export class Pmessage {
  @PrimaryGeneratedColumn({ type: "int", name: "pmessageId" })
  privateId: number;

  @Column("int", { name: "fromId" })
  fromId: number;

  @Column("int", { name: "toId" })
  toId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @Column("varchar", { default: "private" })
  type: string;

  @ManyToOne(()=>User,user=>user.pmessages)
  @JoinColumn({name:"fromId"})
  from:User
}

