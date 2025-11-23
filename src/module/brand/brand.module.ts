import { Brand, BrandRepository, brandSchema } from 'src/DB/model/index';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandFactoryService } from './factory';

@Module({

  imports: [

    UserMongoModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: brandSchema }
    ])
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandFactoryService, BrandRepository],
  exports: [BrandService, BrandRepository]
})
export class BrandModule { }
