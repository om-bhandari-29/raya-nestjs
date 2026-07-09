import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class VariantAllowedMetalsDto {
  @ApiProperty({
    example: 1,
    description: 'The metal purity ID (FK to metal_purities)',
  })
  metal_purity_id: number;

  @ApiProperty({
    type: [Number],
    example: [1, 2],
    description: 'Allowed metal color IDs for this purity',
  })
  allowed_color_ids: number[];
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
    example: 1,
    description: 'The metal purity ID (FK to metal_purities)',
  })
  @IsInt()
  metal_master: number;

  @ApiProperty({
    type: [Number],
    example: [1, 2],
    description: 'Allowed metal color IDs for this purity',
  })
  @IsArray()
  @IsInt({ each: true })
  metal_purities: number[];
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
    description: 'List of allowed metal purities and color IDs',
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
