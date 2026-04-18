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
import { ItemGroupService } from './item-group.service';
import { CreateItemGroupDto } from './dto/create-item-group.dto';
import { UpdateItemGroupDto } from './dto/update-item-group.dto';
import {
  CreateItemGroupSwagger,
  FindAllItemGroupsSwagger,
  FindOneItemGroupSwagger,
  UpdateItemGroupSwagger,
  RemoveItemGroupSwagger,
} from './item-group.swagger';

@ApiTags('item-group')
@Controller('item-group')
export class ItemGroupController {
  constructor(private readonly itemGroupService: ItemGroupService) {}

  @Post()
  @CreateItemGroupSwagger()
  create(@Body() createItemGroupDto: CreateItemGroupDto) {
    return this.itemGroupService.create(createItemGroupDto);
  }

  @Get()
  @FindAllItemGroupsSwagger()
  findAll() {
    return this.itemGroupService.findAll();
  }

  @Get(':id')
  @FindOneItemGroupSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemGroupService.findOne(id);
  }

  @Patch(':id')
  @UpdateItemGroupSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemGroupDto: UpdateItemGroupDto,
  ) {
    return this.itemGroupService.update(id, updateItemGroupDto);
  }

  @Delete(':id')
  @RemoveItemGroupSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemGroupService.remove(id);
  }
}
