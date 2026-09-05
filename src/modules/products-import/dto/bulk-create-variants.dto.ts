import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariantInputDto {
  @ApiProperty({ example: 'Gold Ring', description: 'Variant name' })
  @IsString()
  variant_name: string;

  @ApiProperty({ example: 'Man', description: 'Target gender' })
  @IsString()
  target_gender: string;
}

export class BulkCreateVariantsDto {
  @ApiProperty({ example: 'devotion-ring', description: 'Design slug' })
  @IsString()
  design_slug: string;

  @ApiPropertyOptional({ example: 1, description: 'Sub category ID' })
  @IsOptional()
  @IsInt()
  sub_category_id?: number;

  @ApiProperty({ type: [VariantInputDto], description: 'List of variants' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantInputDto)
  variant: VariantInputDto[];
}

export class BulkCreateVariantsResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Variants created successfully' })
  message: string;

  @ApiProperty({ example: 10, description: 'ID of the product design' })
  data: number;
}
