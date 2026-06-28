import { ApiProperty } from '@nestjs/swagger';

export class AllowedMetalDto {
  @ApiProperty({ example: '18K' })
  metal_purity: string;

  @ApiProperty({ example: 'Rose Gold' })
  metal_color: string;
}

export class SizeWeightMatrixEntryDto {
  @ApiProperty({ example: '7.0' })
  ring_size: string;

  @ApiProperty({ example: 20 })
  stone_quantity: number;

  @ApiProperty({ example: 2.35 })
  metal_weight: number;
}

export class ZoneSlotItemDto {
  @ApiProperty({ example: 101 })
  zone_slot_id: number;

  @ApiProperty({ example: 'round' })
  shape_normalized: string;

  @ApiProperty({ example: '1.63479345577291', nullable: true })
  dim_l_mm: string | null;

  @ApiProperty({ example: '1.63479345577291', nullable: true })
  dim_w_mm: string | null;

  @ApiProperty({ example: false })
  is_dynamic_by_size: boolean;

  @ApiProperty({ example: 1, nullable: true })
  fixed_quantity: number | null;

  @ApiProperty({ type: [SizeWeightMatrixEntryDto], nullable: true })
  size_wt_matrix: SizeWeightMatrixEntryDto[] | null;
}

export class ZoneSlotsDto {
  @ApiProperty({ type: [ZoneSlotItemDto], description: 'Center zone slots' })
  ZONE_CENTER: ZoneSlotItemDto[];

  @ApiProperty({ type: [ZoneSlotItemDto], description: 'Halo zone slots' })
  ZONE_HALO: ZoneSlotItemDto[];

  @ApiProperty({ type: [ZoneSlotItemDto], description: 'Gallery zone slots' })
  ZONE_GALLERY: ZoneSlotItemDto[];

  @ApiProperty({ type: [ZoneSlotItemDto], description: 'Shank zone slots' })
  ZONE_SHANK: ZoneSlotItemDto[];

  @ApiProperty({ type: [ZoneSlotItemDto], description: 'Accent zone slots' })
  ZONE_ACCENT: ZoneSlotItemDto[];
}

export class ProductVariantDetailDto {
  @ApiProperty({ example: 42 })
  variantId: number;

  @ApiProperty({ example: 'Standard' })
  variant: string;

  @ApiProperty({ example: 'Women' })
  gender: string;

  @ApiProperty({ type: [AllowedMetalDto] })
  allowed_metals: AllowedMetalDto[];

  @ApiProperty({ type: ZoneSlotsDto })
  zone_slots: ZoneSlotsDto;
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

export class VariantDetailDto {
  @ApiProperty({ example: 42 })
  variantId: number;

  @ApiProperty({ type: [AllowedMetalDto] })
  allowed_metals: AllowedMetalDto[];

  @ApiProperty({ type: ZoneSlotsDto })
  zone_slots: ZoneSlotsDto;
}

export class VariantDetailResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ type: VariantDetailDto })
  data: VariantDetailDto;
}

