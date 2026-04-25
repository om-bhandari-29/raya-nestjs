import { PartialType } from '@nestjs/swagger';
import { CreateItemAttributeValueDto } from './create-item-attribute-value.dto';

export class UpdateItemAttributeValueDto extends PartialType(
  CreateItemAttributeValueDto,
) {}
