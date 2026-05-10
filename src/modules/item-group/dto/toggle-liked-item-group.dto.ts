import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikedItemGroupDto {
  @ApiProperty({ example: 'Jewelry' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name_frappe_based_id: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  liked: boolean;
}
