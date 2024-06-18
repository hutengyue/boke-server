import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {User} from "./entities/User";
import {TypeOrmModule} from "@nestjs/typeorm";
import { TagModule } from './tag/tag.module';
import { VisitModule } from './visit/visit.module';
import { GroupModule } from './group/group.module';
import { ArticleModule } from './article/article.module';
import { LogModule } from './log/log.module';
import { MessageModule } from './message/message.module';
import { CommentModule } from './comment/comment.module';
import { FriendModule } from './friend/friend.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:'565656',
    database:'boke',
    timezone:'Z',
    entities: [__dirname + '/entities/*{.ts,.js}'],
    autoLoadEntities:true,
    synchronize:true
  }),
    TagModule,
    VisitModule,
    GroupModule,
    ArticleModule,
    LogModule,
    MessageModule,
    CommentModule,
    FriendModule,
    CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
