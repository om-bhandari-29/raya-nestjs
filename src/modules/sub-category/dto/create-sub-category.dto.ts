import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Mobile Phones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  item_group_name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
