import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductsImportService } from './products-import.service';
import { BlueprintListResponseDto } from './dto/blueprint-list.dto';
import {
  ImportResponseDto,
  ArchetypeImportResponseDto,
} from './dto/import-result.dto';
import { ProductDetailResponseDto } from './dto/product-detail.dto';

@ApiTags('Products Import')
@Controller('products')
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
  @ApiResponse({
    status: 200,
    description: 'Import completed successfully.',
    type: ImportResponseDto,
  })
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportResponseDto> {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Please attach a CSV file under the field name "file".',
      );
    }

    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'text/plain',
    ];
    if (
      !allowedMimeTypes.includes(file.mimetype) &&
      !file.originalname.endsWith('.csv')
    ) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Please upload a .csv file.`,
      );
    }

    const result = await this.productsImportService.importFromBuffer(
      file.buffer,
    );

    return {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Import completed successfully.',
      data: result,
    };
  }

  @Post('import/archetypes')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Import archetype blueprints from a clean, unpivoted CSV file',
    description:
      'Reads archetype_raw_2026-06-09.csv format, groups by design/variant, ' +
      'maps zones to templates, and unpivots size-specific quantities and metal weights.',
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
  @ApiResponse({
    status: 200,
    description: 'Archetype import completed successfully.',
    type: ArchetypeImportResponseDto,
  })
  async uploadArchetypes(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ArchetypeImportResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const result = await this.productsImportService.importArchetypesFromBuffer(
      file.buffer,
    );

    return {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Archetype import completed successfully.',
      data: result,
    };
  }

  @Get('blueprints')
  @ApiOperation({
    summary: 'Get list of product blueprints grouped by design slug',
    description:
      'This API will scan your product_blueprints table and group by design_slug',
  })
  async getBlueprints(): Promise<BlueprintListResponseDto> {
    const data =
      await this.productsImportService.getBlueprintsGroupedByDesign();
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  @Get('detail/:design_slug')
  @ApiOperation({ summary: 'Get product details by design slug' })
  @ApiParam({
    name: 'design_slug',
    description: 'Unique design slug of the product',
    example: 'devotion-ring',
  })
  @ApiResponse({
    status: 200,
    description: 'Product details retrieved successfully.',
    type: ProductDetailResponseDto,
  })
  async getProductDetails(
    @Param('design_slug') designSlug: string,
  ): Promise<ProductDetailResponseDto> {
    return this.productsImportService.getProductDetails(designSlug);
  }
}
