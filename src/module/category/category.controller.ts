import { Auth, Public, User } from '@common/decorator';

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, ParamIdDto, UpdateCategoryDto } from './dto';
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
  async findOne(@Param() params: ParamIdDto) {
    const category = await this.categoryService.findOne(params.id);
    return {
      message: 'done',
      success: true,
      data: {
        category
      }
    }
  }

  @Put(':id')
  async update(@Param() params: ParamIdDto, @Body() updateCategoryDto: UpdateCategoryDto, @User() user: any) {
    const category = await this.categoryFactoryService.updateCategory(params.id, updateCategoryDto, user);
    const updateCategory = await this.categoryService.update(params.id, category);
    return {
      date: {
        updateCategory
      }
    }
  }

  @Delete(':id')
  async remove(@Param() params: ParamIdDto, @User() user: any) {
    return await this.categoryService.remove(params.id, user);
  }
}
