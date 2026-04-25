import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemAttributeValueDto {
  @ApiProperty({ example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  attribute_value: string;

  @ApiPropertyOptional({ example: 'Metal' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  attribute_type?: string;

  @ApiPropertyOptional({ example: 'GL' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  abbreviation?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  purity_factor?: number;
}
