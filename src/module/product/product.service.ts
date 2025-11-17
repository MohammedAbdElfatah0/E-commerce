import { ProductRepository } from '@model/index';
import { BrandService } from '@module/brand/brand.service';
import { CategoryService } from '@module/category/category.service';
import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
  ) { }
  async create(product: Product) {
    await this.categoryService.findOne(product.categoryId);
    await this.brandService.findOne(product.BrandId);
    return await this.productRepository.create(product);
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
