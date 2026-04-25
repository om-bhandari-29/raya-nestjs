import { PartialType } from '@nestjs/swagger';
import { CreateItemAttributeMasterDto } from './create-item-attribute-master.dto';

export class UpdateItemAttributeMasterDto extends PartialType(
  CreateItemAttributeMasterDto,
) {}
