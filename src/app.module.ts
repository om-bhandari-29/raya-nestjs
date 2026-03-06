import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGTypeORMconfig } from './config/pgsql.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(PGTypeORMconfig),
    ConfigModule.forRoot({
      isGlobal: true,
      // if we dont provide path, it will take .env file,
      // envFilePath: ''
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
