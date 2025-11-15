import { Injectable } from "@nestjs/common";
import { CreateBrandDto } from "../dto/create-brand.dto";
import { Brand } from "../entities/brand.entity";
import slugify from "slugify";
import { User } from "@model/index";

@Injectable()
export class BrandFactoryService {

    public createBrand(createBrandDto: CreateBrandDto, user: User): Brand {
        const brand = new Brand();
        brand.name = createBrandDto.name;
        brand.slug = slugify(brand.name, { replacement: "_", trim: true, lower: true });
        brand.createdBy = user._id;
        brand.updateBy = user._id;
        // brand.logo=createBrandDto.logo;
        return brand;
    }

}