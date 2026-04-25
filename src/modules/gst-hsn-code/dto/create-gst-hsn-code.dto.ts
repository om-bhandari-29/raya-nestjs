import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGstHsnCodeDto {
  @ApiProperty({ example: '8471' })
  @IsString()
  @IsNotEmpty()
  hsn_code: string;

  @ApiProperty({ example: 'Automatic data processing machines and units' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  gst_rate: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
