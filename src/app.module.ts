import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
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
import { AuthModule } from './auth/auth.module';
import config from "./config";

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
    type:'mysql',
    host:config.mysql.host,
    port:config.mysql.port,
    username:config.mysql.user,
    password:config.mysql.pass,
    database:config.mysql.database,
    timezone:'+08:00',
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
    CategoryModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
