import { Auth, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandFactoryService } from './factory';

@Controller('brand')
@Auth(['Admin'])
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly brandFactoryService: BrandFactoryService,
  ) { }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @User() user: any) {
    const brand = this.brandFactoryService.createBrand(createBrandDto, user);
    // return this.brandService.create();
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
