import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity("group", { schema: "boke" })
export class Group {
  @PrimaryGeneratedColumn({ type: "int", name: "groupId" })
  groupId: number;

  @ManyToOne(() => User, user => user.groups)
  @JoinColumn({name:'userId'})
  user: User;

  @Column()
  userId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;
}
