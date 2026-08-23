import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 10, description: 'Design ID' })
  @IsNumber()
  design_id: number;

  @ApiProperty({ example: 'Gold Ring', description: 'Variant name' })
  @IsString()
  variant_name: string;

  @ApiProperty({ example: 'unisex', description: 'Target gender' })
  @IsString()
  target_gender: string;

  @ApiPropertyOptional({ example: 150.0, description: 'Labour costs in INR' })
  @IsOptional()
  @IsNumber()
  labour_costs_in_inr?: number;

  @ApiPropertyOptional({ example: 2.0, description: 'Labour costs in USD' })
  @IsOptional()
  @IsNumber()
  labour_costs_in_usd?: number;
}

export class CreateVariantResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Variant created successfully' })
  message: string;

  @ApiProperty({ example: 42, description: 'ID of the newly created variant' })
  data: number;
}
