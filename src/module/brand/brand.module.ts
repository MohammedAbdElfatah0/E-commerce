import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandFactoryService } from './factory';
import { Brand, BrandRepository, brandSchema } from '@model/index';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/module';

@Module({

  imports: [

    UserMongoModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: brandSchema }
    ])
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandFactoryService, BrandRepository],
})
export class BrandModule { }
