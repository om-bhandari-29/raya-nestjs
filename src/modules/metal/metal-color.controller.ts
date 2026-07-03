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
} from './metal.swagger';

@ApiTags('metal-color')
@Controller('metal-color')
export class MetalColorController {
  constructor(private readonly metalColorService: MetalColorService) {}

  @Post()
  @CreateMetalColorSwagger()
  create(@Body() createMetalColorDto: CreateMetalColorDto) {
    return this.metalColorService.create(createMetalColorDto);
  }

  @Get('combo')
  @ComboMetalColorSwagger()
  combo() {
    return this.metalColorService.combo();
  }

  @Get()
  @FindAllMetalColorsSwagger()
  findAll() {
    return this.metalColorService.findAll();
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
