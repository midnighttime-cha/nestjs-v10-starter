import { ApiProperty } from '@nestjs/swagger';

export interface Authinterfaces {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    accessToken: string;
}