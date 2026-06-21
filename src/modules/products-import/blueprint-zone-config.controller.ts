import { Controller, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsImportService } from './products-import.service';
import { UpdateZoneSlotConfigDto, UpdateZoneSlotResponseDto } from './dto/update-zone-slot.dto';

@ApiTags('Blueprint Zone Config')
@Controller('blueprint-zones')
export class BlueprintZoneConfigController {
  constructor(private readonly productsImportService: ProductsImportService) {}

  @Put('config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update zone slot configurations and its size matrix config',
    description: 'Updates dimensions, dynamism, shape of a zone slot, and replaces its sizing matrix values if dynamic.',
  })
  @ApiResponse({
    status: 200,
    description: 'Zone slot configuration updated successfully.',
    type: UpdateZoneSlotResponseDto,
  })
  async updateZoneSlot(
    @Body() body: UpdateZoneSlotConfigDto,
  ): Promise<UpdateZoneSlotResponseDto> {
    return this.productsImportService.updateZoneSlotConfig(body);
  }
}
