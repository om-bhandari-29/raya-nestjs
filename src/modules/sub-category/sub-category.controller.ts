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
import { ApiTags } from '@nestjs/swagger';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import {
  CreateSubCategorySwagger,
  FindAllSubCategoriesSwagger,
  FindOneSubCategorySwagger,
  UpdateSubCategorySwagger,
  RemoveSubCategorySwagger,
  ComboSubCategorySwagger,
} from './sub-category.swagger';

@ApiTags('sub-category')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  @CreateSubCategorySwagger()
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Get('combo')
  @ComboSubCategorySwagger()
  combo(@Query('item_group_id') itemGroupId?: string) {
    return this.subCategoryService.combo(itemGroupId ? +itemGroupId : undefined);
  }

  @Get()
  @FindAllSubCategoriesSwagger()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  @FindOneSubCategorySwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.findOne(id);
  }

  @Patch(':id')
  @UpdateSubCategorySwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @RemoveSubCategorySwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.remove(id);
  }
}
