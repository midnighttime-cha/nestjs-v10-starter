import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {

    async transform(value: any, metadata: ArgumentMetadata) {

        if (value instanceof Object && this.isEmpty(value)) {
            throw new HttpException(`validation.failed: No body submitted`, HttpStatus.BAD_REQUEST);
        }

        const { metatype } = metadata;

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
    
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        
        if (errors.length > 0) {
            throw new HttpException(`validation.failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
        }
        
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }

    private formatErrors(errors: any[]) {
        return errors.map(err => {
            for (let property in err.constraints) {
                return err.constraints[property];
            }
        })
        .join(', ');
    }

    private isEmpty(value: any) {
        if (Object.keys(value).length > 0) {
            return false;
        }
        return true;
    }
}