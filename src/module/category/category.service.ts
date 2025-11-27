import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/DB/model/index';
import { Category } from './entities/category.entity';
import { Types } from 'mongoose';
/**
 * -- admin role
 * 1- get all category public
 * 2- remove category
 */
@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository
  ) { }
  async create(category: Category): Promise<Category | null> {
    const categoryExist = await this.categoryRepository.getOne({ slug: category.slug });
    if (categoryExist) throw new ConflictException("category is exist");
    return await this.categoryRepository.create(category);
  }

  async findAll(): Promise<Category[] | null> {
    // return `This action returns all category`;
    return await this.categoryRepository.getAll({}, {}, {
      populate: [{ path: 'createdBy' }, { path: 'updatedBy' }]
    });
  }

  async findOne(id: string | Types.ObjectId): Promise<Category> {
    const category = await this.categoryRepository.getOne({ _id: id }, {}, {
      populate: [{ path: 'createdBy' }, { path: 'updatedBy' }]
    });
    if (!category) throw new NotFoundException("category not found");
    return category;
  }

  async update(id: string, category: Category): Promise<Category | null> {
    const categoryExist = await this.categoryRepository.getOne({ slug: category.slug, _id: { $ne: id } });
    if (categoryExist) throw new ConflictException("category already exist");
    const { _id, ...update } = category;
    return await this.categoryRepository.updateOne({ _id: id }, { $set: update }, { new: true });


  }

  async remove(id: string, user: any): Promise<Category | null> {
    //check category exist
    const categoryExist = await this.categoryRepository.getOne({ _id: id });
    if (!categoryExist) throw new NotFoundException("Not found Category");
    //user._id
    return await this.categoryRepository.softDeleteOne(id, {
      $set: {
        deletedBy: user._id,
        deletedAt: Date.now()//chacnge delete hard at next day
      }
    });

  }
}
