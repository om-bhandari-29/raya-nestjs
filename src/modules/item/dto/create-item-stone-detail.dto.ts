import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemStoneDetailDto {
  @ApiProperty({ example: 1, description: 'FK to stone_family' })
  @IsInt()
  @Type(() => Number)
  stone_family_id: number;

  @ApiPropertyOptional({ example: 1, description: 'FK to stone_clarity' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  stone_clarity_id?: number;

  @ApiProperty({ example: 1, description: 'FK to stone_shape' })
  @IsInt()
  @Type(() => Number)
  stone_shape_id: number;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  weight_carat: number;
}
