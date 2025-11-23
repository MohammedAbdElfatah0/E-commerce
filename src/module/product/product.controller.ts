import { MESSAGE } from '@common/constant';
import { Auth, Public, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProdcutFactoryService } from './factory';
import { ProductService } from './product.service';

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
    const productExist = await this.productService.create(produnt, user);

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
  @Public()
  findOne(@Param('id') id: string) {
    const product = this.productService.findOne(id)
    return {
      success: true,
      data: {
        product
      }
    }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {

    // const product=this.productService.update(id,)
    return {
      success: true,
      message: MESSAGE.Product.updated,
      data: {

      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
