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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { StoneService } from './stone.service';
import { StoneImportService } from './stone-import.service';
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
  constructor(
    private readonly stoneService: StoneService,
    private readonly stoneImportService: StoneImportService,
  ) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import stones from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx) containing stone data',
        },
      },
    },
  })
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        status: false,
        message: 'No file uploaded',
        statusCode: 400,
        data: null,
      };
    }

    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = file.originalname
      ?.substring(file.originalname.lastIndexOf('.'))
      ?.toLowerCase();

    if (
      !allowedExtensions.includes(ext) &&
      !allowedMimes.includes(file.mimetype)
    ) {
      return {
        status: false,
        message: 'Invalid file type. Please upload an .xlsx or .xls file.',
        statusCode: 400,
        data: null,
      };
    }

    return this.stoneImportService.importFromExcel(file.buffer, ext);
  }

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

  @Get(':generatedKey')
  @FindOneStoneSwagger()
  findOne(@Param('generatedKey') generatedKey: string) {
    return this.stoneService.findOne(generatedKey);
  }

  @Patch(':generatedKey')
  @UpdateStoneSwagger()
  update(
    @Param('generatedKey') generatedKey: string,
    @Body() updateStoneDto: UpdateStoneDto,
  ) {
    return this.stoneService.update(generatedKey, updateStoneDto);
  }

  @Delete(':id')
  @RemoveStoneSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stoneService.remove(id);
  }
}
