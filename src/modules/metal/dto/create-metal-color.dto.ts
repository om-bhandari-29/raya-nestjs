import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetalColorDto {
  @ApiProperty({ example: 'Yellow' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'YELLOW' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;
}
