import { CategoryRepository, User } from "src/DB/model/index";
import { Injectable, NotFoundException } from "@nestjs/common";
import slugify from "slugify";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from './../dto/create-category.dto';

@Injectable()
export class CategoryFactoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }
    public createCategory(createCategoryDto: CreateCategoryDto, user: User) {
        const category = new Category();
        category.name = createCategoryDto.name;
        category.createdBy = user._id;
        category.updatedBy = user._id;
        category.slug = slugify(category.name, { replacement: '_', lower: true, trim: true });
        //todo:: logo
        return category;
    }
    public async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {

        const oldCategory = await this.categoryRepository.getOne({ _id: id });
        if (!oldCategory) throw new NotFoundException("category not found");
        const category = new Category();
        category.name = updateCategoryDto.name || oldCategory.name;
        category.slug = slugify(category.name, { replacement: '_', lower: true, trim: true });
        category.updatedBy = user._id;
        //todo:: logo
        return category;
    }
}