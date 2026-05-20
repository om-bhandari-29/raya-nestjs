import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGstHsnCodeDto {
  @ApiProperty({ example: '8471' })
  @IsString()
  @IsNotEmpty()
  hsn_code: string;

  @ApiProperty({ example: 'Automatic data processing machines and units' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
