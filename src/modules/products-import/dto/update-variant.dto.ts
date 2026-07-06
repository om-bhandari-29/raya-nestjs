import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateVariantDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product blueprint (variant)',
  })
  @IsNumber()
  variant_id: number;

  @ApiProperty({ example: 'Gold Ring', description: 'New name of the variant' })
  @IsString()
  variant_name: string;

  @ApiProperty({
    example: 'unisex',
    description: 'New target gender of the variant',
  })
  @IsString()
  target_gender: string;
}

export class UpdateVariantResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Variant updated successfully' })
  message: string;
}
