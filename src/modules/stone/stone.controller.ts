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
import { StoneService } from './stone.service';
import { CreateStoneDto } from './dto/create-stone.dto';
import { UpdateStoneDto } from './dto/update-stone.dto';
import {
  CreateStoneSwagger,
  FindAllStonesSwagger,
  FindOneStoneSwagger,
  UpdateStoneSwagger,
  RemoveStoneSwagger,
  ComboStoneSwagger,
} from './stone.swagger';

@ApiTags('stone')
@Controller('stone')
export class StoneController {
  constructor(private readonly stoneService: StoneService) {}

  @Post()
  @CreateStoneSwagger()
  create(@Body() createStoneDto: CreateStoneDto) {
    return this.stoneService.create(createStoneDto);
  }

  @Get('combo')
  @ComboStoneSwagger()
  combo() {
    return this.stoneService.combo();
  }

  @Get()
  @FindAllStonesSwagger()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.stoneService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @FindOneStoneSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stoneService.findOne(id);
  }

  @Patch(':id')
  @UpdateStoneSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoneDto: UpdateStoneDto,
  ) {
    return this.stoneService.update(id, updateStoneDto);
  }

  @Delete(':id')
  @RemoveStoneSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stoneService.remove(id);
  }
}
