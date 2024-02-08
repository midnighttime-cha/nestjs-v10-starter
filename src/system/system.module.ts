import { Global, Module } from '@nestjs/common';
import { EventLogController } from './event-log/event-log.controller';
import { EventLogService } from './event-log/event-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLogsEntities } from './event-log/entities/event-log.entity';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { MenuEntities } from './menu/entities/menu.entity';
import { ResponseService } from 'src/shared/helpers/response.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventLogsEntities,
      MenuEntities
    ]),
    ResponseService
  ],
  controllers: [EventLogController, MenuController],
  providers: [EventLogService, MenuService, ResponseService],
  exports: [EventLogService, ResponseService]
})
export class SystemModule {}
