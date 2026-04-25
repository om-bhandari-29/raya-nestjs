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

  @Get()
  @FindAllAttributesSwagger()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @FindOneAttributeSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UpdateAttributeSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemAttributeMasterDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @RemoveAttributeSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Values endpoints
  @Post(':attributeId/values')
  @CreateValueSwagger()
  createValue(
    @Param('attributeId', ParseIntPipe) attributeId: number,
    @Body() createDto: CreateItemAttributeValueDto,
  ) {
    return this.service.createValue(attributeId, createDto);
  }

  @Get(':attributeId/values')
  @FindAllValuesSwagger()
  findAllValues(@Param('attributeId', ParseIntPipe) attributeId: number) {
    return this.service.findAllValues(attributeId);
  }

  @Get(':attributeId/values/:valueId')
  @FindOneValueSwagger()
  findOneValue(
    @Param('attributeId', ParseIntPipe) attributeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
  ) {
    return this.service.findOneValue(attributeId, valueId);
  }

  @Patch(':attributeId/values/:valueId')
  @UpdateValueSwagger()
  updateValue(
    @Param('attributeId', ParseIntPipe) attributeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Body() updateDto: UpdateItemAttributeValueDto,
  ) {
    return this.service.updateValue(attributeId, valueId, updateDto);
  }

  @Delete(':attributeId/values/:valueId')
  @RemoveValueSwagger()
  removeValue(
    @Param('attributeId', ParseIntPipe) attributeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
  ) {
    return this.service.removeValue(attributeId, valueId);
  }
}
