import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateItemAttributeValueDto } from './create-item-attribute-value.dto';

export class CreateItemAttributeMasterDto {
  @ApiProperty({ example: 'Metal Type' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_base_attribute?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  numeric_values?: boolean;

  @ApiPropertyOptional({ example: 0.0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  from_range?: number;

  @ApiPropertyOptional({ example: 100.0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  to_range?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  increment?: number;

  @ApiPropertyOptional({ type: [CreateItemAttributeValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemAttributeValueDto)
  @IsOptional()
  values?: CreateItemAttributeValueDto[];
}
