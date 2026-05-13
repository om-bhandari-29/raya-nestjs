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
import { UomService } from './uom.service';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomDto } from './dto/update-uom.dto';
import {
  ComboUomSwagger,
  CreateUomSwagger,
  FindAllUomsSwagger,
  FindOneUomSwagger,
  UpdateUomSwagger,
  RemoveUomSwagger,
} from './uom.swagger';

@ApiTags('uom')
@Controller('uom')
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  @CreateUomSwagger()
  create(@Body() createUomDto: CreateUomDto) {
    return this.uomService.create(createUomDto);
  }

  @Get('combo')
  @ComboUomSwagger()
  combo() {
    return this.uomService.combo();
  }

  @Get()
  @FindAllUomsSwagger()
  findAll() {
    return this.uomService.findAll();
  }

  @Get(':name')
  @FindOneUomSwagger()
  findOne(@Param('name') name: string) {
    return this.uomService.findOne(name);
  }

  @Patch(':name')
  @UpdateUomSwagger()
  update(@Param('name') name: string, @Body() updateUomDto: UpdateUomDto) {
    return this.uomService.update(name, updateUomDto);
  }

  @Delete(':name')
  @RemoveUomSwagger()
  remove(@Param('name') name: string) {
    return this.uomService.remove(name);
  }
}
