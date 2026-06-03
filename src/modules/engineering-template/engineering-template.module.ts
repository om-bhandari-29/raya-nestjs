import { Module } from '@nestjs/common';
import { EngineeringTemplateController } from './engineering-template.controller';
import { EngineeringTemplateService } from './engineering-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineeringTemplate } from './entity/engineering-template.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EngineeringTemplate])],
    controllers: [EngineeringTemplateController],
    providers: [EngineeringTemplateService],
    // exports: [EngineeringTemplateService]
})
export class EngineeringTemplateModule { }
