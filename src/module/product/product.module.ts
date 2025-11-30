import { BrandModule } from '@module/brand/brand.module';
import { CategoryModule } from '@module/category/category.module';
import { Module } from '@nestjs/common';
import { UserMongoModule } from '@shared/module';
import { productModule, ProductRepository } from 'src/DB/model/index';
import { ProdcutFactoryService } from './factory';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UserMongoModule,
    productModule,
    CategoryModule,
    BrandModule,

  ],
  controllers: [ProductController],
  providers: [ProductService, ProdcutFactoryService, ProductRepository],
})
export class ProductModule { }
