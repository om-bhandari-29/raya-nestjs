import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductMasterDto {
  @ApiProperty({ example: 'Steel Rod' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  sub_category_id: number;

  @ApiPropertyOptional({ example: 'High quality steel rod' })
  @IsString()
  @IsOptional()
  product_description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
