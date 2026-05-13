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
import { ItemAttributeMasterService } from './item-attribute-master.service';
import { CreateItemAttributeMasterDto } from './dto/create-item-attribute-master.dto';
import { UpdateItemAttributeMasterDto } from './dto/update-item-attribute-master.dto';
import { CreateItemAttributeValueDto } from './dto/create-item-attribute-value.dto';
import { UpdateItemAttributeValueDto } from './dto/update-item-attribute-value.dto';
import {
  ComboAttributeSwagger,
  CreateAttributeSwagger,
  FindAllAttributesSwagger,
  FindOneAttributeSwagger,
  UpdateAttributeSwagger,
  RemoveAttributeSwagger,
  CreateValueSwagger,
  FindAllValuesSwagger,
  FindOneValueSwagger,
  UpdateValueSwagger,
  RemoveValueSwagger,
} from './item-attribute-master.swagger';

@ApiTags('item-attribute-master')
@Controller('item-attribute-master')
export class ItemAttributeMasterController {
  constructor(private readonly service: ItemAttributeMasterService) {}

  @Post()
  @CreateAttributeSwagger()
  create(@Body() createDto: CreateItemAttributeMasterDto) {
    return this.service.create(createDto);
  }

  @Get('combo')
  @ComboAttributeSwagger()
  combo() {
    return this.service.combo();
  }

  @Get()
  @FindAllAttributesSwagger()
  findAll() {
    return this.service.findAll();
  }

  @Get(':name')
  @FindOneAttributeSwagger()
  findOne(@Param('name') name: string) {
    return this.service.findOne(name);
  }

  @Patch(':name')
  @UpdateAttributeSwagger()
  update(
    @Param('name') name: string,
    @Body() updateDto: UpdateItemAttributeMasterDto,
  ) {
    return this.service.update(name, updateDto);
  }

  @Delete(':name')
  @RemoveAttributeSwagger()
  remove(@Param('name') name: string) {
    return this.service.remove(name);
  }

  // Values endpoints
  @Post(':attributeName/values')
  @CreateValueSwagger()
  createValue(
    @Param('attributeName') attributeName: string,
    @Body() createDto: CreateItemAttributeValueDto,
  ) {
    return this.service.createValue(attributeName, createDto);
  }

  @Get(':attributeName/values')
  @FindAllValuesSwagger()
  findAllValues(@Param('attributeName') attributeName: string) {
    return this.service.findAllValues(attributeName);
  }

  @Get(':attributeName/values/:valueId')
  @FindOneValueSwagger()
  findOneValue(
    @Param('attributeName') attributeName: string,
    @Param('valueId', ParseIntPipe) valueId: number,
  ) {
    return this.service.findOneValue(attributeName, valueId);
  }

  @Patch(':attributeName/values/:valueId')
  @UpdateValueSwagger()
  updateValue(
    @Param('attributeName') attributeName: string,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Body() updateDto: UpdateItemAttributeValueDto,
  ) {
    return this.service.updateValue(attributeName, valueId, updateDto);
  }

  @Delete(':attributeName/values/:valueId')
  @RemoveValueSwagger()
  removeValue(
    @Param('attributeName') attributeName: string,
    @Param('valueId', ParseIntPipe) valueId: number,
  ) {
    return this.service.removeValue(attributeName, valueId);
  }
}
