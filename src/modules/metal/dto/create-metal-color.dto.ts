import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetalColorDto {
  @ApiProperty({ example: 'Yellow' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
