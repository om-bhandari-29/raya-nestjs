import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoneMasterService } from './stone-master.service';
import { CreateStoneMasterDto } from './dto/create-stone-master.dto';
import { UpdateStoneMasterDto } from './dto/update-stone-master.dto';
import {
  CreateStoneMasterSwagger,
  FindAllStoneMasterSwagger,
  FindOneStoneMasterSwagger,
  UpdateStoneMasterSwagger,
  RemoveStoneMasterSwagger,
} from './stone-master.swagger';

@ApiTags('stone-master/family')
@Controller('stone-master/family')
export class StoneFamilyController {
  constructor(private readonly service: StoneMasterService) {}

  @Post()
  @CreateStoneMasterSwagger('family')
  create(@Body() dto: CreateStoneMasterDto) {
    return this.service.create('family', dto);
  }

  @Get()
  @FindAllStoneMasterSwagger('family')
  findAll() {
    return this.service.findAll('family');
  }

  @Get(':id')
  @FindOneStoneMasterSwagger('family')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne('family', id);
  }

  @Patch(':id')
  @UpdateStoneMasterSwagger('family')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('family', id, dto);
  }

  @Delete(':id')
  @RemoveStoneMasterSwagger('family')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove('family', id);
  }
}

@ApiTags('stone-master/clarity')
@Controller('stone-master/clarity')
export class StoneClarityController {
  constructor(private readonly service: StoneMasterService) {}

  @Post()
  @CreateStoneMasterSwagger('clarity')
  create(@Body() dto: CreateStoneMasterDto) {
    return this.service.create('clarity', dto);
  }

  @Get()
  @FindAllStoneMasterSwagger('clarity')
  findAll() {
    return this.service.findAll('clarity');
  }

  @Get(':id')
  @FindOneStoneMasterSwagger('clarity')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne('clarity', id);
  }

  @Patch(':id')
  @UpdateStoneMasterSwagger('clarity')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('clarity', id, dto);
  }

  @Delete(':id')
  @RemoveStoneMasterSwagger('clarity')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove('clarity', id);
  }
}

@ApiTags('stone-master/shape')
@Controller('stone-master/shape')
export class StoneShapeController {
  constructor(private readonly service: StoneMasterService) {}

  @Post()
  @CreateStoneMasterSwagger('shape')
  create(@Body() dto: CreateStoneMasterDto) {
    return this.service.create('shape', dto);
  }

  @Get()
  @FindAllStoneMasterSwagger('shape')
  findAll() {
    return this.service.findAll('shape');
  }

  @Get(':id')
  @FindOneStoneMasterSwagger('shape')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne('shape', id);
  }

  @Patch(':id')
  @UpdateStoneMasterSwagger('shape')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('shape', id, dto);
  }

  @Delete(':id')
  @RemoveStoneMasterSwagger('shape')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove('shape', id);
  }
}
