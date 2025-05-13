import { Module } from '@nestjs/common';
import { PmessageService } from './pmessage.service';
import { PmessageController } from './pmessage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pmessage } from 'src/entities/pmessage.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pmessage,User])],
  controllers: [PmessageController],
  providers: [PmessageService],
  exports: [PmessageService]
})
export class PmessageModule {}
