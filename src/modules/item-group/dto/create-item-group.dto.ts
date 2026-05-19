import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemGroupDto {
  @ApiProperty({ example: 'JEWELLERY-GOLD' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_group?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/images/jewellery.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional({ example: '7113' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  gst_hsn_code?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  parent_item_group_id?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  liked?: boolean;
}
