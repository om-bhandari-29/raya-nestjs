import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsImportService } from './products-import.service';
import { ArchetypeImportService } from './archetype-import.service';
import { BlueprintListResponseDto } from './dto/blueprint-list.dto';
import { ArchetypeListPaginatedResponseDto } from './dto/archetype-list.dto';
import {
  ImportResponseDto,
  ArchetypeImportResponseDto,
} from './dto/import-result.dto';
import { ProductDetailResponseDto, VariantDetailResponseDto } from './dto/product-detail.dto';
import { ProductVariantsResponseDto } from './dto/product-variants.dto';
import { UpdateVariantDto, UpdateVariantResponseDto } from './dto/update-variant.dto';
import { CreateVariantDto, CreateVariantResponseDto } from './dto/create-variant.dto';
import { BulkCreateVariantsDto, BulkCreateVariantsResponseDto } from './dto/bulk-create-variants.dto';
import {
  VariantAllowedMetalsDto,
  VariantAllowedMetalsResponseDto,
  UpdateVariantAllowedMetalsDto,
  UpdateVariantAllowedMetalsResponseDto,
} from './dto/variant-allowed-metals.dto';

@ApiTags('Products Import')
@Controller('products')
export class ProductsImportController {
  constructor(
    private readonly productsImportService: ProductsImportService,
    private readonly archetypeImportService: ArchetypeImportService,
  ) { }

  @Get('archetypes')
  @ApiOperation({
    summary: 'Get paginated list of archetypes (product blueprints)',
    description: 'Returns a paginated list of all structural layout blueprints.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, example: 'ring', description: 'Search by design slug or variant name' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of archetypes retrieved successfully.',
    type: ArchetypeListPaginatedResponseDto,
  })
  async getArchetypes(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ArchetypeListPaginatedResponseDto> {
    return this.archetypeImportService.getArchetypesPaginated(page, limit, search);
  }

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

    const result = await this.archetypeImportService.importArchetypesFromBuffer(
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

  @Get('detail/:design_id')
  @ApiOperation({ summary: 'Get product details by design ID' })
  @ApiParam({
    name: 'design_id',
    description: 'Unique design ID of the product',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product details retrieved successfully.',
    type: ProductDetailResponseDto,
  })
  async getProductDetails(
    @Param('design_id', ParseIntPipe) designId: number,
  ): Promise<ProductDetailResponseDto> {
    return this.productsImportService.getProductDetails(designId);
  }

  @Get('variants/:design_id')
  @ApiOperation({
    summary: 'Get all variants with variantId by design ID',
    description: 'Returns all variants and their variantId for a given design ID',
  })
  @ApiParam({
    name: 'design_id',
    description: 'Unique design ID of the product',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product variants retrieved successfully.',
    type: ProductVariantsResponseDto,
  })
  async getVariantsByDesign(
    @Param('design_id', ParseIntPipe) designId: number,
  ): Promise<ProductVariantsResponseDto> {
    return this.productsImportService.getVariantsByDesign(designId);
  }

  @Get('variant/:variantId')
  @ApiOperation({
    summary: 'Get variant allowed metals and zone slots by variant ID',
    description: 'Returns the allowed metals and structural zone slots configured for a specific variant ID',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Unique variant (blueprint) ID',
    example: 42,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Variant configuration retrieved successfully.',
    type: VariantDetailResponseDto,
  })
  async getVariantDetails(
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<VariantDetailResponseDto> {
    return this.productsImportService.getVariantDetails(variantId);
  }

  @Get('variant/:variantId/allowed-metals')
  @ApiOperation({
    summary: 'Get allowed metals (purities and colors) by variant ID',
    description: 'Returns all metal purities mapped with their allowed colors for a given variant ID',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Unique variant (blueprint) ID',
    example: 42,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Allowed metals retrieved successfully.',
    type: VariantAllowedMetalsResponseDto,
  })
  async getAllowedMetalsForVariant(
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<VariantAllowedMetalsResponseDto> {
    return this.productsImportService.getAllowedMetalsForVariant(variantId);
  }

  @Post('variant/allowed-metals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update/set allowed metals (purities and colors) for a variant ID',
    description: 'Deletes existing allowed metal configurations for a variant, and saves the new list.',
  })
  @ApiResponse({
    status: 200,
    description: 'Allowed metals updated successfully.',
    type: UpdateVariantAllowedMetalsResponseDto,
  })
  async updateAllowedMetalsForVariant(
    @Body() body: UpdateVariantAllowedMetalsDto,
  ): Promise<UpdateVariantAllowedMetalsResponseDto> {
    return this.productsImportService.updateAllowedMetalsForVariant(body);
  }

  @Patch('variant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update variant name and target gender of a product blueprint',
    description: 'Finds a product blueprint by its ID and updates its variant name and target gender.',
  })
  @ApiResponse({
    status: 200,
    description: 'Variant updated successfully.',
    type: UpdateVariantResponseDto,
  })
  async updateVariant(
    @Body() body: UpdateVariantDto,
  ): Promise<UpdateVariantResponseDto> {
    return this.productsImportService.updateVariant(body);
  }

  @Post('variant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create a new variant of a product blueprint',
    description: 'Creates a new variant with design_slug, variant_name, and target_gender, and returns the newly created variant ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Variant created successfully.',
    type: CreateVariantResponseDto,
  })
  async createVariant(
    @Body() body: CreateVariantDto,
  ): Promise<CreateVariantResponseDto> {
    return this.productsImportService.createVariant(body);
  }

  @Post('bulk-variants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk create variants under a design slug',
    description: 'Registers multiple variants under a design slug and performs unique constraints checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Variants created successfully.',
    type: BulkCreateVariantsResponseDto,
  })
  async bulkCreateVariants(
    @Body() body: BulkCreateVariantsDto,
  ): Promise<BulkCreateVariantsResponseDto> {
    return this.productsImportService.bulkCreateVariants(body);
  }
}
