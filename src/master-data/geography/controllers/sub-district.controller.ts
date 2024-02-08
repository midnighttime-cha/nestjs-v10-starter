import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubDistrictService } from '../services/sub-district.service';
import { User } from 'src/shared/decorator/user.decorator';
import { AuthGaurd } from 'src/shared/guard/auth.guard';
import { ResponseController } from 'src/shared/response/response.controller';
import { SubDistrictCreateDTO, SubDistrictUpdateDTO } from '../dto/sub-district.dto';
import { MyValidationPipe } from 'src/shared/pipe/my-validation.pipe';
const moduleName = "ตำบล";

@ApiTags("Master Data: Sub District (ตำบล)")
@Controller('master-data/sub-district')
export class SubDistrictController {
    constructor(
        private subDistrictServices: SubDistrictService,
        private resdata: ResponseController
    ) { }

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

        const resdata = await this.subDistrictServices.findData(query, pages);
        return this.resdata.responseFindSuccess(req, res, resdata.items, resdata.total);
    }


    @Get(':id')
    @ApiOperation({ summary: `เรียกดูข้อมูลด้วย "${moduleName}" ID` })
    async findByIdData(@Res() res, @Req() req, @Param() params) {
        const resdata = await this.subDistrictServices.findOneData(null, params.id);
        return this.resdata.responseFindOneSuccess(req, res, resdata.items);
    }


    // Method POST
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: `เพิ่มข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe)
    async create(@Req() req, @Res() res, @Body() body: SubDistrictCreateDTO, @User() payload) {
        const responseData = await this.subDistrictServices.create(body, payload.id);

        await this.resdata.addEventLog(payload.id, req, responseData, moduleName, {
            userId: payload.id,
            moduleId: responseData.id,
            module: "MASTERDATA_SUB_DISTRICT",
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
    @UsePipes(new MyValidationPipe)
    async update(@Res() res, @Body() body: SubDistrictUpdateDTO, @User() payload, @Req() req, @Param('id') id: number) {
        const responseData = await this.subDistrictServices.update(id, body, payload.id);

        await this.resdata.addEventLog(payload.id, req, { id, ...body }, moduleName, {
            userId: payload.id,
            moduleId: id,
            module: "MASTERDATA_SUB_DISTRICT",
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
    @UsePipes(new MyValidationPipe)
    async deleteData(@Param('id') id, @Req() req, @Res() res, @User() payload) {
        const deleted = await this.subDistrictServices.delete(id, payload.id);

        await this.resdata.addEventLog(payload.id, req, {id}, moduleName, {
            userId: payload.id,
            moduleId: id,
            module: "MASTERDATA_SUB_DISTRICT",
            detail: `[${payload.username}] ลบข้อมูล "${moduleName}"`
        });

        return this.resdata.responseDeleteSuccess(req, res, deleted);
    }


    // PATCH Method
    @ApiParam({ name: 'id' })
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `เรียกคืนข้อมูล "${moduleName}" ที่ถูกลบ` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe)
    async restore(@Param('id') id, @Req() req, @Res() res, @User() payload) {
        const restored = await this.subDistrictServices.restore(id, payload.id);

        await this.resdata.addEventLog(payload.id, req, { id }, moduleName, {
            userId: payload.id,
            moduleId: id,
            module: "MASTERDATA_SUB_DISTRICT",
            detail: `[${payload.username}] เรียกคืนข้อมูล "${moduleName}" ที่ถูกลบ`
        });

        return this.resdata.responseDeleteSuccess(req, res, restored);
    }
}
