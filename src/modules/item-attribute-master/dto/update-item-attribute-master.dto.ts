import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateItemAttributeMasterDto } from './create-item-attribute-master.dto';
import { UpsertItemAttributeValueDto } from './upsert-item-attribute-value.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateItemAttributeMasterDto extends PartialType(
  OmitType(CreateItemAttributeMasterDto, ['values'] as const),
) {
  @ApiPropertyOptional({ type: [UpsertItemAttributeValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertItemAttributeValueDto)
  @IsOptional()
  values?: UpsertItemAttributeValueDto[];
}
