import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { DateTransformer } from "../utils/dateTransform";
import * as bcrypt from 'bcryptjs'
import { Comment } from "./comment.entity";
import { Gmessage } from "./gmessage.entity";
import {Message} from "./message.entity";
import {Pmessage} from "./pmessage.entity";
import { Group } from "./group.entity";

@Entity("user", { schema: "boke" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "userId" })
  userId: number;

  @Column("varchar", { name: "headImg", length: 255, default: () => "'https://file.cavalry.xin/boke/2025/04/20/Tom.jpg'"})
  headImg: string;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255,select:false })
  password: string;

  @Column("int", { name: "sex", default: () => "'1'" })
  sex: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "introduction", length: 255,default: () => "'此人很懒，什么也没留下'"  })
  introduction: string;

  @Column("varchar", { name: "identity", length: 255, default: () => "'user'" })
  identity: string;

  @CreateDateColumn({ type:"datetime",name:"createAt" ,transformer:new DateTransformer()})
  createAt: Date;

  @OneToMany(() => Gmessage, gmessage => gmessage.user)
  gmessages: Gmessage[];

  @OneToMany(() => Message, message => message.user)
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_friends',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'userId'
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'userId'
    }
  })
  friends:User[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = bcrypt.hashSync(this.password, 10);
  }

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @ManyToMany(() => Group, group => group.members)
  @JoinTable({
    name: 'group_members',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'userId'
    },
    inverseJoinColumn: {
      name: 'groupId',
      referencedColumnName: 'groupId'
    }
  })
  groups: Group[];

  @OneToMany(() => Pmessage, pmessage => pmessage.from)
  pmessages: Pmessage[];
}
