import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SaveWeightDto } from './dto/save-weight.dto';
import {
  CreateItemSwagger,
  FindAllItemsSwagger,
  FindOneItemSwagger,
  UpdateItemSwagger,
  RemoveItemSwagger,
  OptionsItemSwagger,
  SaveWeightSwagger,
} from './item.swagger';

@ApiTags('item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @CreateItemSwagger()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get('options')
  @OptionsItemSwagger()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  options(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.itemService.options(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
      search,
    );
  }

  @Get()
  @FindAllItemsSwagger()
  findAll() {
    return this.itemService.findAll();
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.itemService.findByName(name);
  }

  @Get(':id')
  @FindOneItemSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @Patch(':id/weight')
  @SaveWeightSwagger()
  saveWeight(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveWeightDto: SaveWeightDto,
  ) {
    return this.itemService.saveWeight(id, saveWeightDto);
  }

  @Patch(':id')
  @UpdateItemSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @RemoveItemSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(id);
  }
}
