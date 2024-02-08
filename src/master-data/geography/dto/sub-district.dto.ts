import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SubDistrictCreateDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    districtId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
    
}

export class SubDistrictUpdateDTO {

    @ApiProperty()
    districtId: number;

    @ApiProperty()
    nameTh: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    active: boolean;
    
}