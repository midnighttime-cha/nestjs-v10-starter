import { Global, Module } from '@nestjs/common';
import { DatetimeService } from './datetime.service';
import { ResponseService } from './response.service';
import { EventLogService } from 'src/system/event-log/event-log.service';
import { HelperService } from './helper.service';

@Global()
@Module({
    providers: [
        DatetimeService,
        ResponseService,
        HelperService
    ],
    exports: [
        DatetimeService,
        ResponseService,
        HelperService
    ],
})
export class HelperModule {}
