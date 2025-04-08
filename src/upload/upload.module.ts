import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import {MulterModule} from "@nestjs/platform-express";
import * as multer from "multer";

@Module({
  imports:[
      MulterModule.register({
          storage: multer.diskStorage({
              destination:(req,file,callback)=> {
                  let uploadPath = './public/'
                  if(req.url=='/upload/image'){
                      uploadPath += 'image/'
                  }else if(req.url == '/upload/md'){
                      uploadPath += 'md/'
                  }
                  callback(null,uploadPath)
              },
              filename: (req, file, callback) => {
                  callback(null,  `${Date.now()}-${file.originalname}`);
              },
          }),
      })
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
