import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitService } from './visit.service';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}
  @Get()
  getAll(){
    return this.visitService.findAll()
  }
}
