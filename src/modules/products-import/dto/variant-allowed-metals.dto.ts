import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AllowedMetalPurityDto {
  @ApiProperty({
    example: 1,
    description: 'The metal purity ID',
  })
  metal_purity_id: number;

  @ApiProperty({
    example: '18k',
    description: 'The metal purity name/description',
  })
  metal_purity_name: string;

  @ApiProperty({
    example: 5200.50,
    description: 'Rate per gram in INR',
    nullable: true,
  })
  rate_per_gram_inr: number;

  @ApiProperty({
    example: 65.50,
    description: 'Rate per gram in USD',
    nullable: true,
  })
  rate_per_gram_usd: number;

  @ApiProperty({
    example: 75.00,
    description: 'Percentage of the metal purity',
    nullable: true,
  })
  percentage: number;
}

export class VariantAllowedMetalsDto {
  @ApiProperty({
    example: 1,
    description: 'The metal master ID',
  })
  metal_master_id: number;

  @ApiProperty({
    example: 'Yellow Gold',
    description: 'The metal master color name',
  })
  metal_master: string;

  @ApiProperty({
    type: [AllowedMetalPurityDto],
    description: 'Allowed metal purity IDs and names for this metal master',
  })
  allowed_metal_purities_id: AllowedMetalPurityDto[];
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
