import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DistrictCreateDTO {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    provinceId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

}

export class DistrictUpdateDTO {

    @ApiProperty()
    provinceId: number;

    @ApiProperty()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    active: boolean;

}