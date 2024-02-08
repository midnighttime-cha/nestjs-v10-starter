import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { MenuService } from './menu.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MenuCreateDTO, MenuUpdateDTO } from './dto/menu.dto';
import { AuthGaurd } from 'src/shared/guard/auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { MyValidationPipe } from 'src/shared/pipe/my-validation.pipe';
import { ResponseController } from 'src/shared/response/response.controller';
const moduleName = "เมนู";

@ApiTags(`System: Menu (${moduleName})`)
@Controller('system/menu')
export class MenuController {
    constructor(
        private menuServices: MenuService,
        private resdata: ResponseController
    ) {}


    // Get Method
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

        const resdata = await this.menuServices.findData(query, pages);
        return this.resdata.responseFindSuccess(req, res, resdata.items, resdata.total);
    }


    @Get(':id')
    @ApiOperation({ summary: `เรียกดูข้อมูลด้วย "${moduleName}" ID` })
    async findByIdData(@Res() res, @Req() req, @Param() params) {
        const resdata = await this.menuServices.findOneData(null, params.id);
        return this.resdata.responseFindOneSuccess(req, res, resdata.items);
    }

    @Get(':code/by-code')
    @ApiOperation({ summary: `เรียกดูข้อมูลด้วยรหัส "${moduleName}"` })
    async findByCodeData(@Res() res, @Req() req, @Param() params) {
        const resdata = await this.menuServices.findOneData(params);
        return this.resdata.responseFindOneSuccess(req, res, resdata.items);
    }


    // Method POST
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: `เพิ่มข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async create(@Req() req, @Res() res, @Body() body: MenuCreateDTO, @User() payload) {
        const responseData = await this.menuServices.create(body, payload.id);

        await this.resdata.addEventLog(payload.id, req, responseData, moduleName, {
            userId: payload.id,
            moduleId: responseData.id,
            module: "SYSTEM_MENU",
            detail: `[${payload.username}] เพิ่มข้อมูล "${moduleName}"`
        });

        return this.resdata.responseFindOneSuccess(req, res, responseData);
    }


    // PUT Method
    @Put(':id')
    @ApiParam({ name: 'id' })
    @ApiBearerAuth()
    @ApiOperation({ summary: `แก้ไขข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async update(@Res() res, @Body() body: MenuUpdateDTO, @User() payload, @Req() req, @Param('id') id: number) {
        const responseData = await this.menuServices.update(id, body, payload.id);

        await this.resdata.addEventLog(payload.id, req, { id, ...body }, moduleName, {
            userId: payload.id,
            moduleId: id,
            module: "SYSTEM_MENU",
            detail: `[${payload.username}] แก้ไขข้อมูล "${moduleName}"`
        });

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
        const deleted = await this.menuServices.delete(id, payload.id);

        await this.resdata.addEventLog(payload.id, req, {id}, moduleName, {
            userId: payload.id,
            moduleId: id,
            module: "SYSTEM_MENU",
            detail: `[${payload.username}] ลบข้อมูล "${moduleName}"`
        });

        return this.resdata.responseDeleteSuccess(req, res, deleted);
    }
}
