import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LabourRateOnEnum } from '../../../core/enum/labour-rate-on.enum';

export class CreateProductMasterDto {
  @ApiProperty({ example: 'Steel Rod' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  sub_category_id: number;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @IsNotEmpty()
  labour_rate: number;

  @ApiProperty({ enum: LabourRateOnEnum, example: LabourRateOnEnum.net })
  @IsEnum(LabourRateOnEnum)
  @IsNotEmpty()
  labour_rate_on: LabourRateOnEnum;

  @ApiPropertyOptional({ example: 'High quality steel rod' })
  @IsString()
  @IsOptional()
  product_description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
