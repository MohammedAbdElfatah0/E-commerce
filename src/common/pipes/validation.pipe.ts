import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // Handle empty or missing body
    if (value === null || value === undefined || Object.keys(value).length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        error: 'Request body cannot be empty',
      });
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((err) => {
        if (err.constraints) {

          return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
        }
        return `${err.property} - validation error`;
      });

      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
