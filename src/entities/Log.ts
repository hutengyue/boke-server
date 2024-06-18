import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";

@Entity("log", { schema: "boke" })
export class Log {
  @PrimaryGeneratedColumn({ type: "int", name: "logId" })
  logId: number;

  @Column("varchar", { name: "content", length: 255 })
  content: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;
}
