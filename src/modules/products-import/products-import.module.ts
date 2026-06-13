import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsImportService } from './products-import.service';
import { ArchetypeImportService } from './archetype-import.service';
import { ProductsImportController } from './products-import.controller';
import { ProductBlueprint } from './entity/product-blueprint.entity';
import { ProductMetalOption } from './entity/product-metal-option.entity';
import { BlueprintZoneSlot } from './entity/blueprint-zone-slot.entity';
import { BlueprintSizeMatrix } from './entity/blueprint-size-matrix.entity';

@Module({
  imports: [
    // Registers the four entities so TypeORM is aware of them within this module.
    // The service uses raw SQL via DataSource injection, not Repository instances,
    // but the entity registration is kept here for consistency and future use.
    TypeOrmModule.forFeature([
      ProductBlueprint,
      ProductMetalOption,
      BlueprintZoneSlot,
      BlueprintSizeMatrix,
    ]),
  ],
  providers: [ProductsImportService, ArchetypeImportService],
  controllers: [ProductsImportController],
  exports: [ProductsImportService, ArchetypeImportService],
})
export class ProductsImportModule {}
