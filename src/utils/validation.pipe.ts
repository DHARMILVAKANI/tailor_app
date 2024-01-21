import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return true;
    }
    const object = plainToClass(metatype, value);
    let errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
    });
    if (errors.length > 0) {
      let constraints = errors[0].constraints;
      // checks if error occured in sub dto
      if (!constraints) {
        constraints = errors[0].children[0].constraints;
        errors = errors[0].children;
      }
      const firstErrorMessage = constraints[Object.keys(constraints)[0]];
      throw new BadRequestException({
        message: firstErrorMessage,
        data: this.buildError(errors),
      });
    }
    return object;
  }
  private buildError(errors: ValidationError[]) {
    const result: { [key: string]: string } = {};
    errors.forEach((el) => {
      const prop = el.property;
      Object.entries(el.constraints).forEach((constraint) => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }

  private toValidate(metatype: CallableFunction): boolean {
    const types: CallableFunction[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
