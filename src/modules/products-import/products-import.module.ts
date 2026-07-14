import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsImportService } from './products-import.service';
import { ArchetypeImportService } from './archetype-import.service';
import { ProductsImportController } from './products-import.controller';
import { BlueprintZoneConfigController } from './blueprint-zone-config.controller';
import { ProductBlueprint } from './entity/product-blueprint.entity';
import { ProductMetalOption } from './entity/product-metal-option.entity';
import { BlueprintZoneSlot } from './entity/blueprint-zone-slot.entity';
import { BlueprintSizeMatrix } from './entity/blueprint-size-matrix.entity';
import { ProductDesign } from './entity/product-design.entity';
import { DesignVariantAllowedMetal } from './entity/design-variant-allowed-metal.entity';
import { MetalWeightMatrix } from './entity/metal-weight-matrix.entity';

@Module({
  imports: [
    // Registers the five entities so TypeORM is aware of them within this module.
    // The service uses raw SQL via DataSource injection, not Repository instances,
    // but the entity registration is kept here for consistency and future use.
    TypeOrmModule.forFeature([
      ProductBlueprint,
      ProductMetalOption,
      BlueprintZoneSlot,
      BlueprintSizeMatrix,
      ProductDesign,
      DesignVariantAllowedMetal,
      MetalWeightMatrix,
    ]),
  ],
  providers: [ProductsImportService, ArchetypeImportService],
  controllers: [ProductsImportController, BlueprintZoneConfigController],
  exports: [ProductsImportService, ArchetypeImportService],
})
export class ProductsImportModule {}
