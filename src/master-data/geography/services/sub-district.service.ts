import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HelperService } from 'src/shared/helpers/helper.service';
import { SubDistrictEntities } from '../entities/sub-district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvinceCreateDTO, ProvinceUpdateDTO } from '../dto/province.dto';
import { ProvinceInterfaces } from '../interfaces/province.interface';
import { SubDistrictCreateDTO, SubDistrictUpdateDTO } from '../dto/sub-district.dto';
import { SubDistrictInterfaces } from '../interfaces/sub-district.interface';

@Injectable()
export class SubDistrictService extends HelperService {
    constructor(
        @InjectRepository(SubDistrictEntities)
        private subDistrictRepositories: Repository<SubDistrictEntities>
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
                const { nameTh, nameEn, districtId, active, date, dateStart, dateStop } = filters;

                const filterLikes = { nameTh, nameEn };
                const filterEquals = { districtId, active };

                for (const key in filterLikes) {
                    if(typeof filterLikes[key] !== "undefined") {
                        await conditions.andWhere(`A.${key} LIKE '%${filterLikes[key]}%'`)
                    }
                }
                
                for (const key in filterEquals) {
                    if(typeof filterEquals[key] !== "undefined") {
                        await conditions.andWhere(`A.${key} = :value`, { value: filterEquals[key] })
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
            throw new HttpException(`sub.district.filter: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async findData(filters: any = null, pages: any = null, id: number = 0) {
        try {
            const conditions = await this.subDistrictRepositories.createQueryBuilder("A")
            .leftJoinAndSelect("A.districts", "B")
        
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
            throw new HttpException(`sub.district.find.data: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async findOneData(filters: any = null, id: number = 0) {
        try {
            const conditions = await this.subDistrictRepositories.createQueryBuilder("A")
            .leftJoinAndSelect("A.districts", "B")
        
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
            const items = await getItems.toResponseObject(false, true);
        
            return { items, total: 1 };
        } catch (error) {
            throw new HttpException(`sub.district.find.data.one: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async create(data: SubDistrictCreateDTO, userId: number): Promise<SubDistrictInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                active: true,
                createdBy: userId,
                createdAt: this.dateFormat("YYYY-MM-DD H:i:s"),
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            const creted = await this.subDistrictRepositories.create(data);
            await this.subDistrictRepositories.save(creted);

            return creted.toResponseObject();
        } catch (error) {
          throw new HttpException(`sub.district.create: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async update(id: number, data: SubDistrictUpdateDTO, userId: number): Promise<SubDistrictEntities> {
        try {
            Object.assign(data, {
                ...data,
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            await this.subDistrictRepositories.update(id, data);

            return await this.subDistrictRepositories.findOne({ where: {id} });
        } catch (error) {
          throw new HttpException(`sub.district.update: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }



    async delete(id: number, userId: number) {
        try {

            const deleted = await this.subDistrictRepositories.softDelete(id);
            await this.subDistrictRepositories.update(id, { deletedBy: userId });

            if(deleted) {
                return true;
            } else {
                throw new HttpException(`sub.district.delete.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`sub.district.delete: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async restore(id: number, userId: number) {
        try {

            const restored = await this.subDistrictRepositories.restore(id);
            await this.subDistrictRepositories.update(id, { deletedBy: null });

            if(restored) {
                return true;
            } else {
                throw new HttpException(`sub.district.restore.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`sub.district.restored: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
