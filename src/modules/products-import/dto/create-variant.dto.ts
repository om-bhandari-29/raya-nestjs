import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'devotion-ring', description: 'Design slug' })
  @IsString()
  design_slug: string;

  @ApiProperty({ example: 'Gold Ring', description: 'Variant name' })
  @IsString()
  variant_name: string;

  @ApiProperty({ example: 'unisex', description: 'Target gender' })
  @IsString()
  target_gender: string;
}

export class CreateVariantResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Variant created successfully' })
  message: string;

  @ApiProperty({ example: 42, description: 'ID of the newly created variant' })
  data: number;
}
