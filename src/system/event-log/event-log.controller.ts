import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventLogService } from './event-log.service';
import { ResponseService } from 'src/shared/helpers/response.service';
import { EventLogsDTO } from './dto/event-log.dto';
import { ApiOperation, ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { User } from 'src/shared/decorator/user.decorator';
import { AuthGaurd } from 'src/shared/guard/auth.guard';
import { MyValidationPipe } from 'src/shared/pipe/my-validation.pipe';
const moduleName = "ประวัติการใช้งาน";

@ApiTags(`System: Event log (${moduleName})`)
@Controller('system/event-log')
export class EventLogController {
    constructor(
        private eventLogServices: EventLogService,
        private resdata: ResponseService
    ) { }

    // Get Method
    @Get()
    @ApiOperation({ summary: `เรียกดูข้อมูล "${moduleName}" ทั้งหมด` })
    @ApiQuery({ name: "dateStop", type: Date, required: false, description: "YYYY-MM-DD" })
    @ApiQuery({ name: "dateStart", type: Date, required: false, description: "YYYY-MM-DD" })
    @ApiQuery({ name: "date", type: Date, required: false, description: "YYYY-MM-DD" })
    @ApiQuery({ name: "method", enum: ["GET", "POST", "PUT", "DELETE", "PATCH"], required: false })
    async findData(@Res() res, @Req() req, @Query() query) {

        let pages = null;

        if(typeof query.start !== "undefined" && typeof query.limit !== "undefined") {
            pages = {
                start: Number(query.start) || 0,
                limit: Number(query.limit) || 10
            };
        }

        const resdata = await this.eventLogServices.findData(query, pages);
        return this.resdata.responseFindSuccess(req, res, resdata.items, resdata.total);
    }


    @Get(':id')
    @ApiOperation({ summary: `เรียกดูข้อมูลด้วย "${moduleName}" ID` })
    @ApiParam({ name: "id", type: Number })
    async findByIdData(@Res() res, @Req() req, @Param() params) {
        const responseData = await this.eventLogServices.findOneData(null, params.id);
        return this.resdata.responseFindOneSuccess(req, res, responseData.items);
    }


    // Method POST
    @Post()
    @ApiBearerAuth()
    @ApiQuery({ name: "timestamp", type: Date })
    @ApiOperation({ summary: `เพิ่มข้อมูล "${moduleName}"` })
    @UseGuards(new AuthGaurd())
    @UsePipes(new MyValidationPipe())
    async createData(@Req() req, @Res() res, @Body() body: EventLogsDTO, @User("id") userId: number) {
        const responseData = await this.eventLogServices.createData(body, userId);
        return this.resdata.responseFindOneSuccess(req, res, responseData);
    }
}
