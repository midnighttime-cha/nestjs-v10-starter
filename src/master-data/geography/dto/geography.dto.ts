import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class GeographyCreateDTO {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

}

export class GeographyUpdateDTO {

    @ApiProperty()
    name: string;

    @ApiProperty()
    active: boolean;

}