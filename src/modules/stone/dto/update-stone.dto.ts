import { PartialType } from '@nestjs/swagger';
import { CreateStoneDto } from './create-stone.dto';

export class UpdateStoneDto extends PartialType(CreateStoneDto) {}
