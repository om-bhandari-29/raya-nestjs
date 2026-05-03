import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoneDto {
  @ApiProperty({ example: 'Round' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shape: string;

  @ApiProperty({ example: 'Diamond' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stoneName: string;

  @ApiProperty({ example: 'Brilliant' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cutStyle: string;

  @ApiPropertyOptional({ example: 'South Africa' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  origin?: string;

  @ApiPropertyOptional({ example: 'VS1' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  clarity?: string;

  @ApiPropertyOptional({ example: 'D' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  colour?: string;

  @ApiProperty({ example: 'Natural' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stoneType: string;

  @ApiPropertyOptional({ example: 'Excellent' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  cutGrade?: string;

  @ApiPropertyOptional({ example: 'South Africa' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  countryOrigin?: string;

  @ApiPropertyOptional({ example: 'None' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  enhancementTreatment?: string;

  @ApiPropertyOptional({ example: 'import_batch_001.csv' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  sourceFile?: string;

  @ApiPropertyOptional({ example: '1.00-2.00 ct' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sizeRange?: string;

  @ApiPropertyOptional({ example: 5.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  length?: number;

  @ApiPropertyOptional({ example: 5.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional({ example: 3.15 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({ example: 1.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedWeightInCt?: number;

  @ApiPropertyOptional({ example: 5000.00 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pricePerCt?: number;

  @ApiPropertyOptional({ example: 6000.00 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pricePerCtUsd?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
