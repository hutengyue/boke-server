import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import { User } from "./user.entity";
import { Gmessage } from "./gmessage.entity";

@Entity("group", { schema: "boke" })
export class Group {
  @PrimaryGeneratedColumn({ type: "int", name: "groupId" })
  groupId: number;

  @Column("varchar", { name: "groupName", length: 255 })
  groupName: string;

  @Column("varchar", { name: "introduction", length: 255, default: () => "'这个群主很懒，什么也没写'" })
  introduction: string;

  @Column("varchar", { name: "headImg", length: 255, default: () => "'image/Tom.jpg'" })
  headImg: string;

  @CreateDateColumn({ type: "datetime", name: "createAt", transformer: new DateTransformer() })
  createAt: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'group_members',
    joinColumn: {
      name: 'groupId',
      referencedColumnName: 'groupId'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'userId'
    }
  })
  members: User[];

  @OneToMany(() => Gmessage, gmessage => gmessage.group)
  messages: Gmessage[];
}