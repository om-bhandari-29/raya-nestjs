import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
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
  attribute_name: string;

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

  @ApiPropertyOptional({ type: [CreateItemAttributeValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemAttributeValueDto)
  @IsOptional()
  values?: CreateItemAttributeValueDto[];
}
