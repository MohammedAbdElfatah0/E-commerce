import { MESSAGE } from '@common/constant';
import { Auth, Public, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProdcutFactoryService } from './factory';
import { ProductService } from './product.service';

@Controller('product')
@Auth(['Admin', 'Seller'])
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productFactoryService: ProdcutFactoryService,
  ) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @User() user: any) {

    const produnt = this.productFactoryService.createProduct(createProductDto, user);
    const productExist = await this.productService.create(produnt, user);

    return {
      product: productExist
    }
  }

  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id)
    return {

      product

    }

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @User() user: any) {
    const productExist = await this.productService.findOne(id);
    const product = this.productFactoryService.updateProduct(updateProductDto, productExist, user)
    const updateProduct = await this.productService.update(id, product);
    return {
      product: updateProduct
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.productService.remove(id, user);
  }
}
