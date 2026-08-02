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
import { MetalPurityService } from './metal-purity.service';
import { CreateMetalPurityDto } from './dto/create-metal-purity.dto';
import { UpdateMetalPurityDto } from './dto/update-metal-purity.dto';
import {
  ComboMetalPuritySwagger,
  CreateMetalPuritySwagger,
  FindAllMetalPuritiesSwagger,
  FindOneMetalPuritySwagger,
  UpdateMetalPuritySwagger,
  RemoveMetalPuritySwagger,
  GetAllowedMetalsByVariantSwagger,
  GroupedByMetalSwagger,
  CalculateWeightSwagger,
} from './metal.swagger';
import { CalculateWeightDto } from './dto/calculate-weight.dto';

@ApiTags('metal-purity')
@Controller('metal-purity')
export class MetalPurityController {
  constructor(private readonly metalPurityService: MetalPurityService) {}

  @Post()
  @CreateMetalPuritySwagger()
  create(@Body() createMetalPurityDto: CreateMetalPurityDto) {
    return this.metalPurityService.create(createMetalPurityDto);
  }

  @Get('combo')
  @ComboMetalPuritySwagger()
  combo() {
    return this.metalPurityService.combo();
  }

  @Get('master/purities')
  @GroupedByMetalSwagger()
  groupedByMetal(@Query('isPagination') isPagination?: string) {
    return this.metalPurityService.groupedByMetal();
  }

  @Post('calculate-weight')
  @CalculateWeightSwagger()
  calculateWeight(@Body() dto: CalculateWeightDto) {
    return this.metalPurityService.calculateWeight(dto.variantId, dto.targetPurity);
  }

  @Get()
  @FindAllMetalPuritiesSwagger()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('metal_type', new ParseIntPipe({ optional: true }))
    metal_type: number = -1,
    @Query('search') search?: string,
  ) {
    return this.metalPurityService.findAll(page, limit, search, metal_type);
  }

  @Get(':id')
  @FindOneMetalPuritySwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metalPurityService.findOne(id);
  }

  @Patch(':id')
  @UpdateMetalPuritySwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetalPurityDto: UpdateMetalPurityDto,
  ) {
    return this.metalPurityService.update(id, updateMetalPurityDto);
  }

  @Delete(':id')
  @RemoveMetalPuritySwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metalPurityService.remove(id);
  }

  @Get('variant/:variantId')
  @GetAllowedMetalsByVariantSwagger()
  findByVariantId(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.metalPurityService.findByVariantId(variantId);
  }
}
