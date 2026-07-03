import { PartialType } from '@nestjs/swagger';
import { CreateMetalPurityDto } from './create-metal-purity.dto';

export class UpdateMetalPurityDto extends PartialType(CreateMetalPurityDto) {}
