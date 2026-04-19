import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ItemGroupModule } from './modules/item-group/item-group.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { ProductMasterModule } from './modules/product-master/product-master.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGTypeORMconfig } from './config/pgsql.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(PGTypeORMconfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ItemGroupModule,
    SubCategoryModule,
    ProductMasterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
