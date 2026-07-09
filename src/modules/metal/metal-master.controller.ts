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
import { MetalColorService } from './metal-color.service';
import { CreateMetalColorDto } from './dto/create-metal-color.dto';
import { UpdateMetalColorDto } from './dto/update-metal-color.dto';
import {
  ComboMetalColorSwagger,
  CreateMetalColorSwagger,
  FindAllMetalColorsSwagger,
  FindOneMetalColorSwagger,
  UpdateMetalColorSwagger,
  RemoveMetalColorSwagger,
  FindMetalsWithPuritiesSwagger,
} from './metal.swagger';

@ApiTags('metal-master')
@Controller('metal-master')
export class MetalMasterController {
  constructor(private readonly metalColorService: MetalColorService) {}

  @Post()
  @CreateMetalColorSwagger()
  create(@Body() createMetalColorDto: CreateMetalColorDto) {
    return this.metalColorService.create(createMetalColorDto);
  }

  @Get('combo')
  @ComboMetalColorSwagger()
  combo(
    @Query('variantId', new ParseIntPipe({ optional: true }))
    variantId: number = null,
    @Query('metalPurityId', new ParseIntPipe({ optional: true }))
    metalPurityId: number = null,
  ) {
    return this.metalColorService.combo(variantId, metalPurityId);
  }

  @Get()
  @FindAllMetalColorsSwagger()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.metalColorService.findAll(page, limit, search);
  }

  @Get('purities')
  @FindMetalsWithPuritiesSwagger()
  findMetalsWithPurities(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
    @Query('metal_id', new ParseIntPipe({ optional: true })) metal_id?: number,
    @Query('isPagination') isPagination?: string,
  ) {
    const isPaginationActive = isPagination === 'true';
    return this.metalColorService.findMetalsWithPurities(
      page,
      limit,
      search,
      metal_id,
      isPaginationActive,
    );
  }

  @Get(':id')
  @FindOneMetalColorSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metalColorService.findOne(id);
  }

  @Patch(':id')
  @UpdateMetalColorSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetalColorDto: UpdateMetalColorDto,
  ) {
    return this.metalColorService.update(id, updateMetalColorDto);
  }

  @Delete(':id')
  @RemoveMetalColorSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metalColorService.remove(id);
  }
}
