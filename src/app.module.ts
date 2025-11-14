import { HttpExceptionFilter } from '@common/index';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configLoad from "./config/env/dev.env";
import { AuthModule, BrandModule, CategoryModule, ProductModule } from './module';

@Module({
  imports: [
    //import file .env
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [configLoad]

      },
    ),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("db").url,
      })
    }),


    AuthModule,
    BrandModule,
    ProductModule,
    CategoryModule

  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  
  ],
})
export class AppModule { }
