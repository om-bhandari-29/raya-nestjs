import { PartialType } from '@nestjs/swagger';
import { CreateGstHsnCodeDto } from './create-gst-hsn-code.dto';

export class UpdateGstHsnCodeDto extends PartialType(CreateGstHsnCodeDto) {}
