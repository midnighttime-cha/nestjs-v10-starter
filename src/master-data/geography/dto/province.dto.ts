import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProvinceCreateDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    geographyId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;

}

export class ProvinceUpdateDTO {

    @ApiProperty()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    geographyId: number;

    @ApiProperty()
    active: boolean;

}