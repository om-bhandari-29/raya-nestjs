import { ApiProperty } from '@nestjs/swagger';

export class ImportResultDataDto {
  @ApiProperty({
    example: 5,
    description: 'Number of unique blueprints processed',
  })
  blueprintsProcessed: number;

  @ApiProperty({
    example: 10,
    description: 'Number of metal options inserted/updated',
  })
  metalOptionsInserted: number;

  @ApiProperty({
    example: 15,
    description: 'Number of zone slots inserted/updated',
  })
  zoneSlotsInserted: number;

  @ApiProperty({
    example: 315,
    description: 'Number of size matrix rows inserted/updated',
  })
  sizeMatrixRowsInserted: number;
}

export class ImportResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Import completed successfully.' })
  message: string;

  @ApiProperty({ type: ImportResultDataDto })
  data: ImportResultDataDto;
}

export class ArchetypeImportResultDataDto {
  @ApiProperty({
    example: 3,
    description: 'Number of unique blueprints processed',
  })
  blueprintsProcessed: number;

  @ApiProperty({
    example: 12,
    description: 'Number of zone slots inserted/updated',
  })
  zoneSlotsInserted: number;

  @ApiProperty({
    example: 252,
    description: 'Number of size matrix rows inserted/updated',
  })
  sizeMatrixRowsInserted: number;
}

export class ArchetypeImportResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Archetype import completed successfully.' })
  message: string;

  @ApiProperty({ type: ArchetypeImportResultDataDto })
  data: ArchetypeImportResultDataDto;
}
