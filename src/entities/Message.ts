import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";

@Entity("message", { schema: "boke" })
export class Message {
  @PrimaryGeneratedColumn({ type: "int", name: "messageId" })
  messageId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("varchar", { name: "message", length: 255 })
  message: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

}
