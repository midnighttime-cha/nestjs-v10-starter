import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EventLogsDTO {

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    timestamp: Date;

    @ApiProperty()
    ip: string;

    @ApiProperty()
    method: string;

    @ApiProperty()
    path: string;

    @ApiProperty()
    requestPayload: string;

    @ApiProperty()
    origin: string;

    @ApiProperty()
    apiName: string;

    @ApiProperty()
    moduleId: number;

    @ApiProperty()
    module: string;

    @ApiProperty()
    subModule: string;

    @ApiProperty()
    subModuleId: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    detail: string;

}