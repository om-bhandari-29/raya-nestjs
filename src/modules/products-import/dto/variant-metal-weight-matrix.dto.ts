import { ApiProperty } from '@nestjs/swagger';
import { VariantAllowedMetalsDto } from './variant-allowed-metals.dto';
import { IsInt, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class VariantMetalWeightMatrixDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  ring_size: number;

  @ApiProperty({ example: 2.56 })
  @IsNumber()
  base_metal_weight_gm: number;
}

export class VariantMetalWeightMatrixBaseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'Metal weight matrix retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({ type: [VariantMetalWeightMatrixDto] })
  data: VariantMetalWeightMatrixDto[];
}

export class VariantMetalWeightMatrixPostBaseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'Metal weight matrix retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({ type: null })
  data: null;
}

export class PostMetalWeightMatrixDto {
  @ApiProperty({ example: 350 })
  @IsInt()
  variantId: number;

  @ApiProperty({
    type: () => [VariantMetalWeightMatrixDto],
  })
  @ValidateNested({ each: true })
  @Type(() => VariantMetalWeightMatrixDto)
  metalWeightMatrix: VariantMetalWeightMatrixDto[];
}
