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
import { ProductMasterService } from './product-master.service';
import { CreateProductMasterDto } from './dto/create-product-master.dto';
import { UpdateProductMasterDto } from './dto/update-product-master.dto';
import {
  ComboProductMasterSwagger,
  CreateProductMasterSwagger,
  FindAllProductMastersSwagger,
  FindOneProductMasterSwagger,
  UpdateProductMasterSwagger,
  RemoveProductMasterSwagger,
} from './product-master.swagger';

@ApiTags('product-master')
@Controller('product-master')
export class ProductMasterController {
  constructor(private readonly productMasterService: ProductMasterService) {}

  @Post()
  @CreateProductMasterSwagger()
  create(@Body() createProductMasterDto: CreateProductMasterDto) {
    return this.productMasterService.create(createProductMasterDto);
  }

  @Get('combo')
  @ComboProductMasterSwagger()
  combo(@Query('sub_category_id') subCategoryId?: string) {
    return this.productMasterService.combo(subCategoryId ? +subCategoryId : undefined);
  }

  @Get()
  @FindAllProductMastersSwagger()
  findAll() {
    return this.productMasterService.findAll();
  }

  @Get(':id')
  @FindOneProductMasterSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productMasterService.findOne(id);
  }

  @Patch(':id')
  @UpdateProductMasterSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductMasterDto: UpdateProductMasterDto,
  ) {
    return this.productMasterService.update(id, updateProductMasterDto);
  }

  @Delete(':id')
  @RemoveProductMasterSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productMasterService.remove(id);
  }
}
