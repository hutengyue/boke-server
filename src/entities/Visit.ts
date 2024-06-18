import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";

@Entity("visit", { schema: "boke" })
export class Visit {
  @PrimaryGeneratedColumn({ type: "int", name: "visitId" })
  visitId: number;

  @Column("varchar", { name: "location", length: 255 })
  location: string;

  @Column("varchar", { name: "browser", length: 255 })
  browser: string;

  @Column("varchar", { name: "clientIp", nullable: true, length: 255 })
  clientIp: string | null;

  @Column("varchar", { name: "device", length: 255 })
  device: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;
}
