import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseService } from 'src/shared/helpers/response.service';
import { ApiOperation, ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthGaurd } from 'src/shared/guard/auth.guard';
import { UserCreateDTO } from './dto/user.dto';
import { User } from 'src/shared/decorator/user.decorator';
import { MyValidationPipe } from 'src/shared/pipe/my-validation.pipe';
const moduleName = "ผู้ใช้งาน";

@ApiBearerAuth()
@UseGuards(new AuthGaurd())
@ApiTags(`User (${moduleName})`)
@Controller('user')
export class UserController {
    constructor(
        private readonly userServices: UserService,
        private readonly resdata: ResponseService
    ) { }

    // Get Method
    @ApiBearerAuth()
    @UseGuards(new AuthGaurd())
    @Get()
    @ApiOperation({ summary: `เรียกดูข้อมูล "${moduleName}" ทั้งหมด` })
    async findData(@Res() res, @Req() req, @Query() query) {

        let pages = null;

        if(typeof query.start !== "undefined" && typeof query.limit !== "undefined") {
            pages = {
                start: Number(query.start) || 0,
                limit: Number(query.limit) || 10
            };
        }

        const resdata = await this.userServices.findData(query, pages);
        return this.resdata.responseFindSuccess(req, res, resdata.items, resdata.total);
    }


    @Get(':id')
    @ApiOperation({ summary: `เรียกดูข้อมูล "${moduleName}" ด้วย ID` })
    async findByIdData(@Res() res, @Req() req, @Param() params) {
        const resdata = await this.userServices.findOneData(null, params.id);
        return this.resdata.responseFindOneSuccess(req, res, resdata.items);
    }



    // Method POST
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: `เพิ่มข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async create(@Req() req, @Res() res, @Body() body: UserCreateDTO, @User() payload) {
        const responseData = await this.userServices.create(body, payload.id);
        return this.resdata.responseFindOneSuccess(req, res, responseData);
    }


    // PUT Method
    @Put(':id')
    @ApiParam({ name: 'id' })
    @ApiBearerAuth()
    @ApiOperation({ summary: `แก้ไขข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async update(@Res() res, @Body() body: UserCreateDTO, @User() payload, @Req() req, @Param('id') id: number) {
        const responseData = await this.userServices.update(id, body, payload.id);
        return this.resdata.responseUpdateSuccess(req, res, responseData);
    }


    // DELETE Method
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `ลบข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async deleteData(@Param('id') id, @Req() req, @Res() res, @User() payload) {
        const deleted = await this.userServices.delete(id, payload.id);
        return this.resdata.responseDeleteSuccess(req, res, deleted);
    }


    // PATCH Method
    @ApiParam({ name: 'id' })
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `เรียกคืนข้อมูล "${moduleName}" ที่ถูกลบ` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async restore(@Param('id') id, @Req() req, @Res() res, @User() payload) {
        const restored = await this.userServices.restore(id, payload.id);
        return this.resdata.responseDeleteSuccess(req, res, restored);
    }
}
