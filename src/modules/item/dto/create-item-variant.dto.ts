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
  @ApiPropertyOptional({ example: 'Gold 22K', description: 'Variant value' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  value?: string;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_master id' })
  @IsInt()
  @Type(() => Number)
  attribute_master_id: number;

  @ApiPropertyOptional({ example: 'Silver', description: 'Attribute value' })
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
}
