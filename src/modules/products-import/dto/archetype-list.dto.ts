import { ApiProperty } from '@nestjs/swagger';
import { BlueprintListItemDto } from './blueprint-list.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class ArchetypeListPaginatedDataDto {
  @ApiProperty({ type: [BlueprintListItemDto] })
  items: BlueprintListItemDto[];
}

export class ArchetypeListPaginatedResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Archetypes retrieved successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: ArchetypeListPaginatedDataDto })
  data: ArchetypeListPaginatedDataDto;

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
