import { PartialType } from '@nestjs/swagger';
import { CreateStoneMasterDto } from './create-stone-master.dto';

export class UpdateStoneMasterDto extends PartialType(CreateStoneMasterDto) {}
