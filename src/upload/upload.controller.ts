import {Controller, Post, UploadedFile, UseInterceptors,Get} from '@nestjs/common';
import { UploadService } from './upload.service';
import {FileInterceptor} from "@nestjs/platform-express";

class fileInterceptor extends FileInterceptor('file'){

}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(fileInterceptor)
  async uploadImage(@UploadedFile() file){
    // return this.uploadService.uploadFile(file)
  }

  @Post('md')
  @UseInterceptors(fileInterceptor)
  async uploadMd(@UploadedFile() file){
    // return this.uploadService.uploadFile(file)
  }

  @Get('getOssConfig')
  async getOss(){
    return this.uploadService.GenerateSignature()
  }
}
