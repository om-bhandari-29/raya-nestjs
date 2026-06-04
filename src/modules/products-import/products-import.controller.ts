import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsImportService } from './products-import.service';
import { BlueprintListResponseDto } from './dto/blueprint-list.dto';

@ApiTags('Products Import')
@Controller('products-import')
export class ProductsImportController {
  constructor(private readonly productsImportService: ProductsImportService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      // Keep the file in memory as a Buffer — no disk I/O, safe for 50k-row CSVs
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB hard cap
    }),
  )
  @ApiOperation({
    summary: 'Bulk-import product blueprints from a flat CSV/Excel-export file',
    description:
      'Accepts a UTF-8 CSV file with exploded SKU rows and compresses them into ' +
      'product_blueprints, product_metal_options, blueprint_zone_slots, and blueprint_size_matrix.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{
    status: boolean;
    statusCode: number;
    message: string;
    data: {
      blueprintsProcessed: number;
      metalOptionsInserted: number;
      zoneSlotsInserted: number;
      sizeMatrixRowsInserted: number;
    };
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded. Please attach a CSV file under the field name "file".');
    }

    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!allowedMimeTypes.includes(file.mimetype) && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Please upload a .csv file.`,
      );
    }

    const result = await this.productsImportService.importFromBuffer(file.buffer);

    return {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Import completed successfully.',
      data: result,
    };
  }

  @Get('blueprints')
  @ApiOperation({
    summary: 'Get list of product blueprints grouped by design slug',
    description: 'This API will scan your product_blueprints table and group by design_slug',
  })
  async getBlueprints(): Promise<BlueprintListResponseDto> {
    const data = await this.productsImportService.getBlueprintsGroupedByDesign();
    return {
      success: true,
      count: data.length,
      data,
    };
  }
}
