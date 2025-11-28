import { Injectable } from "@nestjs/common";
import { CreateBrandDto } from "../dto/create-brand.dto";
import { Brand } from "../entities/brand.entity";
import slugify from "slugify";
import { User } from "src/DB/model/index";
import { UpdateBrandDto } from "../dto/update-brand.dto";

@Injectable()
export class BrandFactoryService {

    public createBrand(createBrandDto: CreateBrandDto, user: User): Brand {
        const brand = new Brand();
        brand.name = createBrandDto.name;
        brand.slug = slugify(brand.name, { replacement: "_", trim: true, lower: true });
        brand.createdBy = user._id;
        brand.updatedBy = brand.createdBy;
        // brand.logo=createBrandDto.logo;
        return brand;
    }
    public updateBrand(updateBrandDto: UpdateBrandDto, user: User): Brand {
        const brand = new Brand();
        brand.name = updateBrandDto.name as string;
        brand.slug = slugify(brand.name, { replacement: "_", trim: true, lower: true });
        brand.updatedBy = user._id;
        // brand.logo=createBrandDto.logo;
        // return brand;
        console.log(brand);
        return brand;
    }

}