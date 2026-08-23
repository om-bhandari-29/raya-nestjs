import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateVariantDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product blueprint (variant)',
  })
  @IsNumber()
  variant_id: number;

  @ApiProperty({ example: 'Gold Ring', description: 'New name of the variant' })
  @IsString()
  variant_name: string;

  @ApiProperty({
    example: 'unisex',
    description: 'New target gender of the variant',
  })
  @IsString()
  target_gender: string;

  @ApiPropertyOptional({ example: 150.0, description: 'New labour costs in INR' })
  @IsOptional()
  @IsNumber()
  labour_cost_in_inr?: number;

  @ApiPropertyOptional({ example: 2.0, description: 'New labour costs in USD' })
  @IsOptional()
  @IsNumber()
  labour_cost_in_usd?: number;
}

export class UpdateVariantResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Variant updated successfully' })
  message: string;
}
