import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLogsEntities } from './entities/event-log.entity';
import { EventLogsDTO } from './dto/event-log.dto';
import { HelperService } from 'src/shared/helpers/helper.service';

@Injectable()
export class EventLogService extends HelperService {
    constructor(
        @InjectRepository(EventLogsEntities)
        private eventLogsRepositories: Repository<EventLogsEntities>
    ) {
        super();
    }

    // Filter
    async doFilter(conditions, filters: any = null, moduleId: number = 0) {
        try {
            if (moduleId > 0) {
                await conditions.where("A.id = :moduleId", { moduleId });
            } else {
                await conditions.where("A.id <> 0");
            }

            if (filters) {
                const { date, ip, method, path, requestPayload, origin, apiName, moduleId, module, subModule, subModuleId, userId, detail, dateStart, dateStop, userFirstName } = filters;

                const filterLikes = { ip, path, requestPayload, origin, apiName, detail };
                const filterEquals = { method, moduleId, module, subModule, subModuleId, userId };
                
                for (const key in filterEquals) {
                    if(typeof filterEquals[key] !== "undefined") {
                        await conditions.andWhere(`A.${key} = :value`, { value: filterEquals[key] })
                    }
                }

                for (const key in filterLikes) {
                    if(typeof filterLikes[key] !== "undefined") {
                        await conditions.andWhere(`A.${key} LIKE '%${filterLikes[key]}%'`)
                    }
                }

                if(typeof date !== "undefined") {
                    await conditions.andWhere("TO_CHAR(A.timestamp, 'YYYY-MM-DD') = :date", { date });
                }

                if(typeof dateStart !== "undefined" && typeof dateStop === "undefined") {
                    await conditions.andWhere("TO_CHAR(A.timestamp, 'YYYY-MM-DD') = :dateStart", { dateStart });
                }

                if(typeof dateStart !== "undefined" && typeof dateStop !== "undefined") {
                    await conditions.andWhere("A.timestamp BETWEEN :dateStart AND :dateStop", { dateStart, dateStop });
                }

                if(typeof userFirstName !== "undefined") {
                    await conditions.andWhere(`B.username LIKE '%${userFirstName}%'`)
                    await conditions.orWhere(`B.firstName LIKE '%${userFirstName}%'`)
                    await conditions.orWhere(`B.lastName LIKE '%${userFirstName}%'`)
                }
            }

            return await conditions;
        } catch (error) {
            throw new HttpException(`event.log.filter: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async findData(filters: any = null, pages: any = null, id: number = 0) {
        try {
            const conditions = await this.eventLogsRepositories.createQueryBuilder("A")
            .leftJoinAndSelect("A.users", "B");
        
            await this.doFilter(conditions, filters, id);
        
            const total = await conditions.getCount();
        
            if (pages) {
                await conditions
                    .skip(pages.start)
                    .take(pages.limit);
            }
        
            if (filters) {
                if (typeof filters.sort !== "undefined") {
                const _sorts = `${filters.sort}`.split('-');
                await conditions.orderBy(`A.${_sorts[0]}`, _sorts[1] === "DESC" ? "DESC" : "ASC");
                } else {
                await conditions
                    .orderBy("A.id", "ASC");
                }
            }
        
            const getItems = await conditions.cache(true).getMany();
            const items = await total > 0 ? getItems.map(element => element.toResponseObject(false, true)) : [];
        
            return { items, total };
        } catch (error) {
            throw new HttpException(`event.log.find.data: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async findOneData(filters: any = null, id: number = 0) {
        try {
            const conditions = await this.eventLogsRepositories.createQueryBuilder("A")
            .leftJoinAndSelect("A.users", "B");
        
            await this.doFilter(conditions, filters, id);
        
            if(filters) {
                if (typeof filters.sort !== "undefined") {
                    const _sorts = `${filters.sort}`.split('-');
                    await conditions.orderBy(`A.${_sorts[0]}`, _sorts[1] === "DESC" ? "DESC" : "ASC");
                }
            } else {
                await conditions
                .orderBy("A.id", "DESC");
            }
        
            const getItems = await conditions.getOne();
            const items = await getItems ? getItems.toResponseObject(false, true) : null;
        
            return { items, total: 1 };
        } catch (error) {
            throw new HttpException(`event.log.find.data.one: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    // Method POST
    async createData(data: EventLogsDTO, userId: number = 0) {
        try {
            if (userId > 0) {
                data.userId = userId;
            }
            const created = await this.eventLogsRepositories.create(data);
            await this.eventLogsRepositories.save(created);
            return await created.toResponseObject();
        } catch (error) {
            throw new HttpException(`event.log.create: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
