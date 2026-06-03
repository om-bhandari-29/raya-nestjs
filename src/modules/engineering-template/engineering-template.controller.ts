import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EngineeringTemplateService } from './engineering-template.service';
import {
  FindAllEngineeringTemplatesSwagger,
  UploadEngineeringTemplateSwagger,
} from './engineering-template.swagger';

@ApiTags('Engineering Template')
@Controller('engineering-template')
export class EngineeringTemplateController {
  constructor(private readonly service: EngineeringTemplateService) {}

  @Get()
  @FindAllEngineeringTemplatesSwagger()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by Template ID, Zone, Shape or Placement',
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.service.findAll(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
      search,
    );
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @UploadEngineeringTemplateSwagger()
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Send the file under the "file" field.',
      );
    }

    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type "${file.mimetype}". Only .xlsx / .xls files are accepted.`,
      );
    }

    const result = await this.service.uploadFromExcel(file.buffer);

    return {
      message: 'Upload complete',
      inserted: result.inserted,
      updated: result.updated,
      errorCount: result.errors.length,
      errors: result.errors,
    };
  }
}
