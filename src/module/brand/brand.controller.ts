import { Auth, Public, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, ParamIdDto, UpdateBrandDto } from './dto';
import { BrandFactoryService } from './factory';

@Controller('brand')
@Auth(['Admin'])
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly brandFactoryService: BrandFactoryService,
  ) { }

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto, @User() user: any) {
    const brand = this.brandFactoryService.createBrand(createBrandDto, user);
    const brandCreated = await this.brandService.create(brand);
    return {
      data: brandCreated,
    }
  }

  @Get()
  @Public()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param() params: ParamIdDto) {
    return this.brandService.findOne(params.id);
  }
  
  @Patch(':id')
  async update(@Param() params: ParamIdDto, @Body() updateBrandDto: UpdateBrandDto, @User() user: any) {
    const updateBrand = this.brandFactoryService.updateBrand(updateBrandDto, user)
    return await this.brandService.update(params.id, updateBrand);
  }

  @Delete(':id')
  async remove(@Param() params: ParamIdDto, @User() user: any) {
    return await this.brandService.remove(params.id, user);
  }
}
