import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DistrictEntities } from '../entities/district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/helpers/helper.service';
import { DistrictCreateDTO, DistrictUpdateDTO } from '../dto/district.dto';
import { DistrictInterfaces } from '../interfaces/district.interface';

@Injectable()
export class DistrictService extends HelperService {
    constructor(
        @InjectRepository(DistrictEntities)
        private communityRepositories: Repository<DistrictEntities>
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
                const { provinceId, nameTh, nameEn, active, date, dateStart, dateStop } = filters;

                const filterLikes = { nameTh, nameEn };
                const filterEquals = { provinceId, active };
                
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
                    await conditions.andWhere("TO_CHAR(A.createdAt, 'YYYY-MM-DD') = :date", { date });
                }

                if(typeof dateStart !== "undefined" && typeof dateStop === "undefined") {
                    await conditions.andWhere("TO_CHAR(A.createdAt, 'YYYY-MM-DD') = :dateStart", { dateStart });
                }

                if(typeof dateStart !== "undefined" && typeof dateStop !== "undefined") {
                    await conditions.andWhere("A.createdAt BETWEEN :dateStart AND :dateStop", { dateStart, dateStop });
                }
            }

            return await conditions;
        } catch (error) {
            throw new HttpException(`district.filter: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async findData(filters: any = null, pages: any = null, id: number = 0) {
        try {
            const conditions = await this.communityRepositories.createQueryBuilder("A")
            .leftJoinAndSelect("A.provinces", "B")
        
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
                    await conditions.orderBy("A.id", "ASC");
                }
            }
        
            const getItems = await conditions.cache(true).getMany();
            const items = await getItems.map(element => element.toResponseObject(false, true));
        
            return { items, total };
        } catch (error) {
            throw new HttpException(`district.find.data: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async findOneData(filters: any = null, id: number = 0) {
        try {
            const conditions = await this.communityRepositories.createQueryBuilder("A");
        
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
            const items = await getItems.toResponseObject();
        
            return { items, total: 1 };
        } catch (error) {
            throw new HttpException(`district.find.data.one: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }



    async create(data: DistrictCreateDTO, userId: number): Promise<DistrictInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                active: true,
                createdBy: userId,
                createdAt: this.dateFormat("YYYY-MM-DD H:i:s"),
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            const creted = await this.communityRepositories.create(data);
            await this.communityRepositories.save(creted);

            return creted.toResponseObject();
        } catch (error) {
          throw new HttpException(`district.create: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async update(id: number, data: DistrictUpdateDTO, userId: number): Promise<DistrictInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            await this.communityRepositories.update(id, data);

            return await this.communityRepositories.findOne({ where: {id} });
        } catch (error) {
          throw new HttpException(`district.update: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }



    async delete(id: number, userId: number) {
        try {

            const deleted = await this.communityRepositories.softDelete(id);
            await this.communityRepositories.update(id, { deletedBy: userId });

            if(deleted) {
                return true;
            } else {
                throw new HttpException(`district.delete.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`district.delete: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async restore(id: number, userId: number) {
        try {

            const restored = await this.communityRepositories.restore(id);
            await this.communityRepositories.update(id, { deletedBy: null });

            if(restored) {
                return true;
            } else {
                throw new HttpException(`district.restore.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`district.restored: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
