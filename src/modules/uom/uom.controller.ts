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

  @Get(':id')
  @FindOneUomSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uomService.findOne(id);
  }

  @Patch(':id')
  @UpdateUomSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUomDto: UpdateUomDto,
  ) {
    return this.uomService.update(id, updateUomDto);
  }

  @Delete(':id')
  @RemoveUomSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uomService.remove(id);
  }
}
