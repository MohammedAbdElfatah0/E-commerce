import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/DB/model/index';
import { Category } from './entities/category.entity';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository
  ) { }
  async create(category: Category) {
    //save into db
    const categoryExist = await this.categoryRepository.getOne({ slug: category.slug });
    if (categoryExist) throw new ConflictException("category is exist");
    return await this.categoryRepository.create(category);
  }

  findAll() {
    return `This action returns all category`;
  }

  async findOne(id: string | Types.ObjectId) {
    const category = await this.categoryRepository.getOne({ _id: id }, {}, {
      populate: [{ path: 'createdBy' }, { path: 'updatedBy' }]
    });
    if (!category) throw new NotFoundException("category not found");
    return category;
  }

  async update(id: string, category: Category) {
    const categoryExist = await this.categoryRepository.getOne({ slug: category.slug, _id: { $ne: id } });
    if (categoryExist) throw new ConflictException("category already exist");
    const { _id, ...update } = category;
    return await this.categoryRepository.updateOne({ _id: id }, { $set: update }, { new: true });


  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
