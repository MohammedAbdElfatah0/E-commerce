import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, User } from '@common/decorator';
import { ProdcutFactoryService } from './factory';
import { MESSAGE } from '@common/constant';

@Controller('product')
@Auth(['Admin', 'Seller  '])
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productFactoryService: ProdcutFactoryService,
  ) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @User() user: any) {
    const produnt = this.productFactoryService.createProduct(createProductDto, user);
    const productExist = await this.productService.create(produnt);

    return {
      message: MESSAGE.Product.created,
      success: true,
      data: {
        product: productExist
      }
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
