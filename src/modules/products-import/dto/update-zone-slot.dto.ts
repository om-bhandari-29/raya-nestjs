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

export class SizeWtMatrixEntryInputDto {
  @ApiProperty({ example: '7.0', description: 'Ring size' })
  @IsString()
  ring_size: string;

  @ApiProperty({ example: 20, description: 'Stone quantity' })
  @IsNumber()
  stone_quantity: number;
}

export class UpdateZoneSlotConfigDto {
  @ApiProperty({ example: 101, description: 'ID of the zone slot to update' })
  @IsNumber()
  zone_slot_id: number;

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

export class UpdateZoneSlotResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Zone slot configuration updated successfully' })
  message: string;
}
