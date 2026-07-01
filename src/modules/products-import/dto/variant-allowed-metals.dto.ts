import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MetalPurity } from '../../../core/enum/metal-purity.enum';
import { MetalColor } from '../../../core/enum/metal-color.enum';

export class VariantAllowedMetalsDto {
  @ApiProperty({
    enum: MetalPurity,
    example: MetalPurity.GOLD_14K,
    description: 'The purity of the metal',
  })
  metal_purity: MetalPurity;

  @ApiProperty({
    type: [String],
    enum: MetalColor,
    isArray: true,
    example: [MetalColor.YELLOW, MetalColor.WHITE],
    description: 'Allowed metal colors for this purity',
  })
  allowed_colors: MetalColor[];
}

export class VariantAllowedMetalsResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Allowed metals retrieved successfully' })
  message: string;

  @ApiProperty({ type: [VariantAllowedMetalsDto] })
  data: VariantAllowedMetalsDto[];
}

export class AllowedMetalInputDto {
  @ApiProperty({
    enum: MetalPurity,
    example: MetalPurity.GOLD_14K,
    description: 'The purity of the metal',
  })
  @IsEnum(MetalPurity)
  metal_purity: MetalPurity;

  @ApiProperty({
    type: [String],
    enum: MetalColor,
    isArray: true,
    example: [MetalColor.YELLOW, MetalColor.WHITE],
    description: 'Allowed metal colors for this purity',
  })
  @IsArray()
  @IsEnum(MetalColor, { each: true })
  metal_color: MetalColor[];
}

export class UpdateVariantAllowedMetalsDto {
  @ApiProperty({
    example: 45,
    description: 'Unique variant (blueprint) ID',
  })
  @IsInt()
  variant_id: number;

  @ApiProperty({
    type: [AllowedMetalInputDto],
    description: 'List of allowed metal purities and colors',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowedMetalInputDto)
  allowed_metals: AllowedMetalInputDto[];
}

export class UpdateVariantAllowedMetalsResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Allowed metals updated successfully' })
  message: string;

  @ApiProperty({ example: 45, description: 'ID of the updated variant' })
  data: number;
}
