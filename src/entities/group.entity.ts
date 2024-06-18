import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";

@Entity("group", { schema: "boke" })
export class Group {
  @PrimaryGeneratedColumn({ type: "int", name: "groupId" })
  groupId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;
}
