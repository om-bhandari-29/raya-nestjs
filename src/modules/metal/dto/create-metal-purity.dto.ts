import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMetalPurityDto {
  @ApiProperty({ example: '14K Gold' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  purity: string;

  @ApiPropertyOptional({ example: '14K Gold Name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  metal_id: number;

  @ApiPropertyOptional({ example: 58.33 })
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @ApiPropertyOptional({ example: 4500.0 })
  @IsNumber()
  @IsOptional()
  rate_per_gram_inr?: number;

  @ApiPropertyOptional({ example: 54.5 })
  @IsNumber()
  @IsOptional()
  rate_per_gram_usd?: number;
}
