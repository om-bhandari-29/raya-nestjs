import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantItemDto {
  @ApiProperty({
    example: 42,
    description: 'Unique ID of the variant blueprint',
  })
  variantId: number;

  @ApiProperty({ example: 'Standard', description: 'Name of the variant' })
  variant_name: string;

  @ApiProperty({
    example: 'Women',
    description: 'Target gender for the variant',
  })
  target_gender: string;
}

export class ProductVariantsResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'devotion-ring', description: 'Design slug' })
  design_slug: string;

  @ApiProperty({ type: [ProductVariantItemDto] })
  data: ProductVariantItemDto[];
}
