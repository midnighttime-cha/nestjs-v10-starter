import { Global, Module } from '@nestjs/common';
import { MyLogger } from '../logger/logger.service';
import { SystemModule } from 'src/system/system.module';
import { ResponseController } from './response.controller';
import { DatetimeService } from '../helpers/datetime.service';

@Global()
@Module({
    imports: [MyLogger, SystemModule],
    exports: [ResponseController],
    providers: [ResponseController, MyLogger, DatetimeService]
})
export class ResponseModule {}
