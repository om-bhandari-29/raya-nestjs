import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoneMasterService } from './stone-master.service';
import { CreateStoneMasterDto } from './dto/create-stone-master.dto';
import { UpdateStoneMasterDto } from './dto/update-stone-master.dto';
import {
  ComboStoneMasterSwagger,
  CreateStoneMasterSwagger,
  FindAllStoneMasterSwagger,
  FindOneStoneMasterSwagger,
  UpdateStoneMasterSwagger,
  RemoveStoneMasterSwagger,
} from './stone-master.swagger';

@ApiTags('stone-master/type')
@Controller('stone-master/type')
export class StoneTypeController {
  constructor(private readonly service: StoneMasterService) {}

  @Post()
  @CreateStoneMasterSwagger('type')
  create(@Body() dto: CreateStoneMasterDto) {
    return this.service.create('type', dto);
  }

  @Get('combo')
  @ComboStoneMasterSwagger('type')
  combo() {
    return this.service.combo('type');
  }

  @Get()
  @FindAllStoneMasterSwagger('type')
  findAll() {
    return this.service.findAll('type');
  }

  @Get(':name')
  @FindOneStoneMasterSwagger('type')
  findOne(@Param('name') name: string) {
    return this.service.findOne('type', name);
  }

  @Patch(':name')
  @UpdateStoneMasterSwagger('type')
  update(@Param('name') name: string, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('type', name, dto);
  }

  @Delete(':name')
  @RemoveStoneMasterSwagger('type')
  remove(@Param('name') name: string) {
    return this.service.remove('type', name);
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

  @Get('combo')
  @ComboStoneMasterSwagger('clarity')
  combo() {
    return this.service.combo('clarity');
  }

  @Get()
  @FindAllStoneMasterSwagger('clarity')
  findAll() {
    return this.service.findAll('clarity');
  }

  @Get(':name')
  @FindOneStoneMasterSwagger('clarity')
  findOne(@Param('name') name: string) {
    return this.service.findOne('clarity', name);
  }

  @Patch(':name')
  @UpdateStoneMasterSwagger('clarity')
  update(@Param('name') name: string, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('clarity', name, dto);
  }

  @Delete(':name')
  @RemoveStoneMasterSwagger('clarity')
  remove(@Param('name') name: string) {
    return this.service.remove('clarity', name);
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

  @Get('combo')
  @ComboStoneMasterSwagger('shape')
  combo() {
    return this.service.combo('shape');
  }

  @Get()
  @FindAllStoneMasterSwagger('shape')
  findAll() {
    return this.service.findAll('shape');
  }

  @Get(':name')
  @FindOneStoneMasterSwagger('shape')
  findOne(@Param('name') name: string) {
    return this.service.findOne('shape', name);
  }

  @Patch(':name')
  @UpdateStoneMasterSwagger('shape')
  update(@Param('name') name: string, @Body() dto: UpdateStoneMasterDto) {
    return this.service.update('shape', name, dto);
  }

  @Delete(':name')
  @RemoveStoneMasterSwagger('shape')
  remove(@Param('name') name: string) {
    return this.service.remove('shape', name);
  }
}
