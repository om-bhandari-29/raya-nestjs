import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    return this.productMasterService.combo(
      subCategoryId ? parseInt(subCategoryId) : null,
    );
  }

  @Get()
  @FindAllProductMastersSwagger()
  findAll() {
    return this.productMasterService.findAll();
  }

  @Get(':name')
  @FindOneProductMasterSwagger()
  findOne(@Param('name') name: string) {
    return this.productMasterService.findOne(name);
  }

  @Patch(':name')
  @UpdateProductMasterSwagger()
  update(
    @Param('name') name: string,
    @Body() updateProductMasterDto: UpdateProductMasterDto,
  ) {
    return this.productMasterService.update(name, updateProductMasterDto);
  }

  @Delete(':name')
  @RemoveProductMasterSwagger()
  remove(@Param('name') name: string) {
    return this.productMasterService.remove(name);
  }
}
