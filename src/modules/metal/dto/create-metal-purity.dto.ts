import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsEnum,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetalType } from '../../../core/enum/metal-type.enum';
import {
  GoldPurityCodeEnum,
  SilverPurityCodeEnum,
  PlatinumPurityCodeEnum,
} from '../../../core/enum/metal-purity.enum';

const AllPurityCodes = [
  ...Object.values(GoldPurityCodeEnum),
  ...Object.values(SilverPurityCodeEnum),
  ...Object.values(PlatinumPurityCodeEnum),
];

export class CreateMetalPurityDto {
  @ApiProperty({ example: '14K Gold' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  purity: string;

  @ApiProperty({ example: GoldPurityCodeEnum.K14, enum: AllPurityCodes })
  @IsIn(AllPurityCodes)
  @IsNotEmpty()
  purity_code: string;

  @ApiPropertyOptional({ example: '14K Gold Name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: MetalType.GOLD, enum: MetalType })
  @IsEnum(MetalType)
  @IsNotEmpty()
  metal_type: MetalType;

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
