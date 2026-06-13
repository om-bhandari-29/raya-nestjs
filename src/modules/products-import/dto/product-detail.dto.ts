import { ApiProperty } from '@nestjs/swagger';

export class AllowedMetalDto {
  @ApiProperty({ example: '18K' })
  metal_purity: string;

  @ApiProperty({ example: 'Rose Gold' })
  metal_color: string;
}

export class SizeMatrixEntryDto {
  @ApiProperty({ example: '7.0' })
  ring_size: string;

  @ApiProperty({ example: 20 })
  stone_quantity: number;
}

export class ZoneSlotDto {
  @ApiProperty({ example: 101 })
  zone_slot_id: number;

  @ApiProperty({ example: 'CENTER' })
  zone_name: string;

  @ApiProperty({ example: 'TPL-CENTER-Round-6.0x6.0' })
  template_id: string;

  @ApiProperty({ example: true })
  is_dynamic_by_size: boolean;

  @ApiProperty({ example: null, nullable: true })
  fixed_quantity: number | null;

  @ApiProperty({ type: [SizeMatrixEntryDto], nullable: true })
  size_quantity_matrix: SizeMatrixEntryDto[] | null;
}

export class ProductVariantDetailDto {
  @ApiProperty({ example: 'Standard' })
  variant: string;

  @ApiProperty({ example: 'Women' })
  gender: string;

  @ApiProperty({ type: [AllowedMetalDto] })
  allowed_metals: AllowedMetalDto[];

  @ApiProperty({ type: [ZoneSlotDto] })
  zone_slots: ZoneSlotDto[];
}

export class ProductDetailDataDto {
  @ApiProperty({ example: 'devotion-ring' })
  design_slug: string;

  @ApiProperty({ type: [ProductVariantDetailDto] })
  variants: ProductVariantDetailDto[];
}

export class ProductDetailResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ProductDetailDataDto })
  data: ProductDetailDataDto;
}
