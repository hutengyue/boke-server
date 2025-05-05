import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { User } from "./user.entity";
import { Group } from "./group.entity";

@Entity("gmessage", { schema: "boke" })
export class Gmessage {
  @PrimaryGeneratedColumn({ type: "int", name: "gmessageId" })
  gmessageId: number;  // 修改属性名，使其更准确

  @ManyToOne(() => User, user => user.gmessages)
  @JoinColumn({name:'userId'})
  user: User;

  @Column("int")
  userId: number;

  @ManyToOne(() => Group, group => group.messages)
  @JoinColumn({name:'groupId'})
  group: Group;

  @Column("int")
  groupId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @Column("varchar", { default: "group" })
  type: string;
}
