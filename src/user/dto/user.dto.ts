import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class UserCreateDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    phoneNo: string;

    @ApiProperty({ required: false })
    mobileNo: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}

export class UserUpdateDTO {

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    username: string;

    @ApiProperty({ required: false })
    password: string;

    @ApiProperty({ required: false })
    email: string;

    @ApiProperty({ required: false })
    phoneNo: string;

    @ApiProperty({ required: false })
    mobileNo: string;

    @ApiProperty({ required: false })
    active: boolean;
}


export class UserRegisterDTO {
    
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

  }