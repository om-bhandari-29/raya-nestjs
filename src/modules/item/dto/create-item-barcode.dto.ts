import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemBarcodeDto {
  @ApiProperty({ example: 'ABC123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  barcode: string;

  @ApiPropertyOptional({ example: 'EAN' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  barcode_type?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  uom_id?: number;
}
