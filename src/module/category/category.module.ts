import { Category, CategoryRepository, categorySchema } from 'src/DB/model/index';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/index';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryFactoryService } from './factory';

@Module({
  imports: [
    UserMongoModule,
    MongooseModule.forFeature([{ name: Category.name, schema: categorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryFactoryService],
  exports: [CategoryService, CategoryRepository]

})
export class CategoryModule { }
