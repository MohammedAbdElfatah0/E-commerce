import { Auth, Public, User } from '@common/decorator';

import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFactoryService } from './factory/index';

@Controller('category')
@Auth(['Admin'])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,
    private readonly categoryFactoryService: CategoryFactoryService,
  ) { }

  @Post("")
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user) {
    const category = this.categoryFactoryService.createCategory(createCategoryDto, user);
    const createdCategory = await this.categoryService.create(category);
    return {
      message: "done created successfully",
      success: true,
      data: {
        createdCategory
      }
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return {
      message: 'done',
      success: true,
      data: {
        category
      }
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @User() user) {
    const category = await this.categoryFactoryService.updateCategory(id, updateCategoryDto, user);
    const updateCategory = await this.categoryService.update(id, category);
    return {
      message: "updated successfully",
      success: true,
      date: {
        updateCategory
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
