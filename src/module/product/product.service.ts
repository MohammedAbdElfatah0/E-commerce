import { ProductRepository, User } from 'src/DB/model/index';
import { BrandService } from '@module/brand/brand.service';
import { CategoryService } from '@module/category/category.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { MESSAGE } from '@common/constant';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
  ) { }
  async create(product: Product, user: User) {
    await this.categoryService.findOne(product.categoryId);
    await this.brandService.findOne(product.BrandId);
    //check product exist 
    const productExist = await this.productRepository.getOne(
      {
        slug: product.slug,
        $or: [
          { createdBy: user._id },
          { updatedBy: user._id }
        ]
      });
    if (productExist) {
      return this.update(productExist._id, product);
    }
    return await this.productRepository.create(product);
  }

  async findAll() {
    const productExist = await this.productRepository.getAll(
      {
        deletedAt: { $exists: false }
      },
      {},
      {}
    );

    return productExist;
  }

  async findOne(id: string | Types.ObjectId) {
    const productExist = await this.productRepository.getOne({ _id: id, deletedAt: { $exists: false } });
    if (!productExist) throw new NotFoundException(MESSAGE.Product.notFound);
    return productExist;
  }

  async update(id: string | Types.ObjectId, product: Product) {
    const productExist = await this.findOne(id);
    product.stock += productExist.stock;
    product.colors = this.addToSet(product.colors, productExist.colors);
    product.sizes = this.addToSet(product.sizes, productExist.sizes);
    return await this.productRepository.updateOne({ _id: id }, product, { new: true });
  }

  async remove(id: string | Types.ObjectId, user: User) {

    await this.findOne(id);
    await this.productRepository.softDeleteOne(
      id,
      {
        $set: {
          deletedAt: Date.now(),
          deletedBy: user._id
        }
      }
    );

  }

  private addToSet(newDate: string[], oldDate: string[]) {
    const items = new Set<string>(oldDate);
    for (const item of newDate) {
      items.add(item);
    }
    return Array.from(items);
  }
}
