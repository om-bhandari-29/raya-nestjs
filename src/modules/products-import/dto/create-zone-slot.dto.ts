import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SizeWtMatrixEntryInputDto } from './update-zone-slot.dto';

export class CreateZoneSlotConfigDto {
  @ApiProperty({
    example: 12,
    description: 'ID of the product blueprint (variant)',
  })
  @IsNumber()
  variant_id: number;

  @ApiProperty({ example: 'Halo', description: 'Zone name' })
  @IsString()
  zone: string;

  @ApiProperty({ example: 'round', description: 'Normalized shape' })
  @IsString()
  shape_normalized: string;

  @ApiProperty({
    example: 1.63,
    required: false,
    nullable: true,
    description: 'Length in mm',
  })
  @IsOptional()
  @IsNumber()
  dim_l_mm: number | null;

  @ApiProperty({
    example: 1.63,
    required: false,
    nullable: true,
    description: 'Width in mm',
  })
  @IsOptional()
  @IsNumber()
  dim_w_mm: number | null;

  @ApiProperty({
    example: true,
    description: 'Is the slot quantity dynamic by ring size?',
  })
  @IsBoolean()
  is_dynamic_by_size: boolean;

  @ApiProperty({
    type: [SizeWtMatrixEntryInputDto],
    required: false,
    description: 'Size weight matrix entries',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeWtMatrixEntryInputDto)
  size_wt_matrix?: SizeWtMatrixEntryInputDto[];

  @ApiProperty({
    example: 1,
    required: false,
    nullable: true,
    description: 'Fixed quantity when is_dynamic_by_size is false',
  })
  @IsOptional()
  @IsNumber()
  fixed_quantity?: number | null;
}

export class CreateZoneSlotResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Zone slot configuration added successfully' })
  message: string;

  @ApiProperty({
    example: 102,
    description: 'The generated ID of the new zone slot',
  })
  data: number;
}
