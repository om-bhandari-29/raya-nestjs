import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemVariantDto {
  @ApiPropertyOptional({ example: 1, description: 'FK to item (variant of)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  variant_of_id?: number;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_master' })
  @IsInt()
  @Type(() => Number)
  attribute_id: number;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_value (must belong to selected attribute)' })
  @IsInt()
  @Type(() => Number)
  value_id: number;

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
}
