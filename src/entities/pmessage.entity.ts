import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";

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
}
