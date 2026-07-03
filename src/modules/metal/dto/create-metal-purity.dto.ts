import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetalPurityDto {
  @ApiProperty({ example: '14K Gold' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'GOLD_14K' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;
}
