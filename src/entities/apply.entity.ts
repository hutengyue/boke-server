import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { User } from "./user.entity";

@Entity("apply", { schema: "boke" })
export class Apply {
  @PrimaryGeneratedColumn({ type: "int", name: "applyId" })
  applyId: number;

  @Column("int", { name: "fromId" })
  fromId: number;

  @Column("int", { name: "toId" })
  toId: number;

  @Column("varchar", { name: "status", length: 255 })
  status: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "fromId" })
  from: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "toId" })
  to: User;
}
