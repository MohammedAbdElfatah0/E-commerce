import { BrandRepository } from '@model/index';
import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { message } from '@common/constant';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {

  }
  async create(brand: Brand) {
    const brandExist = await this.brandRepository.getOne({
      slug: brand.slug
    })
    if (brandExist) throw new ConflictException(message.Brand.alreadyExist);
    return await this.brandRepository.create(brand);

  }

  findAll() {
    return `This action returns all brand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
