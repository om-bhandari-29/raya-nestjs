import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SaveWeightVariantDto {
  @ApiProperty({ example: 0, description: '0 to create, existing id to update' })
  @IsInt()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_master' })
  @IsInt()
  @Type(() => Number)
  attribute_master_id: number;

  @ApiPropertyOptional({ example: 'Silver' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  attribute_value?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean;

  @ApiPropertyOptional({ example: 'Diamond' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  stone_family?: string;

  @ApiPropertyOptional({ example: 'STN-001' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  stone_id?: string;

  @ApiPropertyOptional({ example: 'Gold 22K' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  value?: string;

  @ApiPropertyOptional({ example: 5, description: 'item_master_id (variant of)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  variant_of_id?: number;
}

export class SaveWeightDto {
  @ApiPropertyOptional({ example: 23 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gross_weight?: number;

  @ApiPropertyOptional({ example: 250 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  labor_rate?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  net_weight?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pure_weight_metal?: number;

  @ApiPropertyOptional({ example: 0.2458 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stone_carat_wt?: number;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  stones?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stones_weight_in_gram?: number;

  @ApiProperty({ type: [SaveWeightVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveWeightVariantDto)
  variants: SaveWeightVariantDto[];
}
