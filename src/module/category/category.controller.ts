import { Auth, Public, User } from '@common/decorator';

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFactoryService } from './factory/index';


/**
 * ToDo validation params
 */
@Controller('category')
@Auth(['Admin'])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,
    private readonly categoryFactoryService: CategoryFactoryService,
  ) { }

  @Post("")
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: any) {
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
  @Public()
  async findAll() {
    //some problem if it deleted no result
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @Public()
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
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @User() user: any) {
    const category = await this.categoryFactoryService.updateCategory(id, updateCategoryDto, user);
    const updateCategory = await this.categoryService.update(id, category);
    return {
      date: {
        updateCategory
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    return await this.categoryService.remove(id, user);
  }
}
