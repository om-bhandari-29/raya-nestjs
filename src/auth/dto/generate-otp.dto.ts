import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateOtpDto {
  @ApiProperty({
    description: 'Contact number (10 digits)',
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Contact number must be 10 digits' })
  contactNumber: string;
}
