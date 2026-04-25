import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstHsnCodeController } from './gst-hsn-code.controller';
import { GstHsnCodeService } from './gst-hsn-code.service';
import { GstHsnCode } from './entity/gst-hsn-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GstHsnCode])],
  controllers: [GstHsnCodeController],
  providers: [GstHsnCodeService],
  exports: [GstHsnCodeService],
})
export class GstHsnCodeModule {}
