import { Product, ProductRepository, productSchema } from 'src/DB/model/index';
import { BrandModule } from '@module/brand/brand.module';
import { CategoryModule } from '@module/category/category.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/module';
import { ProdcutFactoryService } from './factory';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UserMongoModule,
    MongooseModule.forFeature(
      [
        { name: Product.name, schema: productSchema },
      ]
    ),
    CategoryModule,
    BrandModule,

  ],
  controllers: [ProductController],
  providers: [ProductService, ProdcutFactoryService, ProductRepository],
})
export class ProductModule { }
