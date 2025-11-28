import { MESSAGE } from '@common/constant';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { BrandRepository } from 'src/DB/model/index';
import { Brand } from './entities/brand.entity';
import { promises } from 'dns';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {

  }
  public async create(brand: Brand) {
    const brandExist = await this.brandRepository.getOne({
      slug: brand.slug, deletedAt: { $exists: false }
    })
    if (brandExist) throw new ConflictException(MESSAGE.Brand.alreadyExist);
    return await this.brandRepository.create(brand);
  }

  public async findAll(): Promise<Brand[] | null> {
    const brandExist = await this.brandRepository.getAll(
      { deletedAt: { $exists: false } },
      {},
      {
        populate: [
          { path: 'createdBy', select: "userName email firstName lastName " },
          { path: 'updatedBy', select: "userName email firstName lastName " }
        ]
      }
    );
    return brandExist;
  }

  public async findOne(id: string | Types.ObjectId): Promise<Brand | null> {
    const brandExist = await this.brandRepository.getOne({
      _id: id, deletedAt: { $exists: false }
    }, {}, {
      populate: [
        { path: 'createdBy', select: "userName email firstName lastName " },
        { path: 'updatedBy', select: "userName email firstName lastName " }
      ]
    })
    if (!brandExist) throw new NotFoundException(MESSAGE.Brand.notFound);
    return brandExist;
  }

  public async update(id: string | Types.ObjectId, brand: Brand): Promise<Brand | null> {
    const brandExist = await this.brandRepository.getOne({
      slug: brand.slug, _id: { $ne: id }, deletedAt: { $exists: false }
    }, {})
    if (brandExist) throw new ConflictException("Brand already Exist");
    //update  name or logo
    /**
     * update include in factory -> name and slug 
     * TODO update logo 
     */
    console.log(brand);
    return await this.brandRepository.updateOne(
      { _id: id },
      {
        $set: {
          name: brand.name,
          slug: brand.slug,
          updatedBy: brand.updatedBy,
          // logo:
        }
      }, {
      populate: [
        { path: 'createdBy', select: "userName email firstName lastName " },
        { path: 'updatedBy', select: "userName email firstName lastName " }
      ]
    }
    )

  }

  public async remove(id: string | Types.ObjectId, user: any) {
    const brandExist = await this.findOne(id);
    await this.brandRepository.softDeleteOne(brandExist!._id, {
      $set: {
        deletedAt: Date.now(),
        deletedBy: user._id
      }
    });
  }
}
