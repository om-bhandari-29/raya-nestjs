import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpsertItemAttributeValueDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ example: 'Gold' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Metal' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  type?: string;

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
