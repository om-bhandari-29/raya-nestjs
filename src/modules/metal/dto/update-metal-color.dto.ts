import { PartialType } from '@nestjs/swagger';
import { CreateMetalColorDto } from './create-metal-color.dto';

export class UpdateMetalColorDto extends PartialType(CreateMetalColorDto) {}
