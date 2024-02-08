import { Body, Controller, Post, Req, Res, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth.dto';
import { ResponseController } from 'src/shared/response/response.controller';
import { MyValidationPipe } from 'src/shared/pipe/my-validation.pipe';

@ApiTags("Authentication & Access")
@Controller('auth')
export class AuthController {

    constructor(
        private readonly userServices: UserService,
        private readonly resdata: ResponseController,
    ) { }

    @ApiOperation({ summary: `เข้าสู่ระบบ` })
    @Post('login')
    @UsePipes(new MyValidationPipe())
    async login(@Req() req, @Res() res, @Body() body: AuthDTO) {
        const items = await this.userServices.userValidate(body);
        
        body.password = "EMPTY";

        await this.resdata.addEventLog(items.id, req, body, "เข้าสู่ระบบ", {
            userId: items.id,
            moduleId: items.id,
            module: "AUTHENTICATION_ACCESS",
            detail: `[${items.username}] เข้าสู่ระบบสำเร็จ`
        });

        return this.resdata.responseAuthSuccess(req, res, items);
    }

    // Method POST
    @ApiOperation({ summary: `ลงทะเบียน` })
    @Post('register')
    @UsePipes(new MyValidationPipe())
    async register(@Req() req, @Res() res, @Body() data: UserRegisterDTO) {
        const responseData = await this.userServices.register(data);
        return this.resdata.responseFindOneSuccess(req, res, responseData);
    }
}
