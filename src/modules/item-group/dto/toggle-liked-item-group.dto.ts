import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikedItemGroupDto {
  @ApiProperty({ example: 'Jewelry' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  liked: boolean;
}
