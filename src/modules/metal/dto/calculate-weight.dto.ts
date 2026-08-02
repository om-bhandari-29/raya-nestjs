import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateWeightDto {
  @ApiProperty({ example: 102 })
  @IsNumber()
  @IsNotEmpty()
  variantId: number;

  @ApiProperty({ example: '18K' })
  @IsString()
  @IsNotEmpty()
  targetPurity: string;
}
