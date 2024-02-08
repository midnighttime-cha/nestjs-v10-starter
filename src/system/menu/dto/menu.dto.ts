import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class MenuCreateDTO {

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(4)
    @MinLength(4)
    code: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ required: false })
    icon: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    type: number;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    mainUrl: string;

    @ApiProperty({ required: false })
    subUrl: string;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty()
    sort: number;

    @ApiProperty({ required: true })
    @IsBoolean()
    @IsNotEmpty()
    active: boolean;
}

export class MenuUpdateDTO {

    @ApiProperty({ required: false })
    code: string;

    @ApiProperty({ required: false })
    title: string;

    @ApiProperty({ required: false })
    icon: string;

    @ApiProperty({ required: false })
    type: number;

    @ApiProperty({ required: false })
    mainUrl: string;

    @ApiProperty({ required: false })
    subUrl: string;

    @ApiProperty({ required: false })
    sort: number;

    @ApiProperty({ required: false })
    active: boolean;

}