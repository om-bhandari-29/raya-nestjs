import { ApiProperty } from '@nestjs/swagger';

export class BlueprintListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'devotion-ring' })
  design_slug: string;

  @ApiProperty({ example: 'Rose Gold' })
  variant_name: string;

  @ApiProperty({ example: 'Women' })
  target_gender: string;
}

export class BlueprintListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: [BlueprintListItemDto] })
  data: BlueprintListItemDto[];
}
