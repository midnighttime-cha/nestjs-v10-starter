import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MenuEntities } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MenuCreateDTO, MenuUpdateDTO } from './dto/menu.dto';
import { MenuInterfaces } from './interfaces/menu.interface';
import { HelperService } from 'src/shared/helpers/helper.service';

@Injectable()
export class MenuService extends HelperService {
    constructor(
        @InjectRepository(MenuEntities)
        private menuRepositories: Repository<MenuEntities>,
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
                const {  code, mainCode, title, type, mainUrl, subUrl, active } = filters;

                const filterLikes = { code, title, mainUrl, subUrl };
                const filterEquals = { type, active };
                
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

                if(typeof mainCode !== "undefined") {
                    await conditions.andWhere(`A.code LIKE '${mainCode}%'`)
                }
            }

            return await conditions;
        } catch (error) {
            throw new HttpException(`[do filter failed.] => ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async findData(filters: any = null, pages: any = null, id: number = 0) {
        try {
            const conditions = await this.menuRepositories.createQueryBuilder("A");
        
            await this.doFilter(conditions, filters, id);
        
            const total = await conditions.getCount();
        
            if (pages) {
                await conditions
                    .skip(pages.start)
                    .take(pages.limit);
            }
            
            if (filters) {
                console.log(filters, "filters")
                if (typeof filters.sort !== "undefined") {
                    const _sorts = `${filters.sort}`.split('-');
                    
                    await conditions.orderBy(`A.${_sorts[0]}`, _sorts[1] === "DESC" ? "DESC" : "ASC");
                } else {
                await conditions
                    .orderBy("A.sort", "ASC");
                }
            }
        
            const getItems = await conditions.cache(true).getMany();
            const items = await total > 0 ? await Promise.all(getItems.map(async element => {
                if(typeof filters.type !== "undefined") {
                    return await getItems ? await this.dataMapper(element, true) : null;
                } else {
                    return await element.toResponseObject();
                }
            })) : [];
        
            return { items, total };
        } catch (error) {
            throw new HttpException(`menu.find.many => ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async findOneData(filters: any = null, id: number = 0) {
        try {
            const conditions = await this.menuRepositories.createQueryBuilder("A");
        
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
            const items = await getItems ? await this.dataMapper(getItems, true) : null;
        
            return { items, total: 1 };
        } catch (error) {
            throw new HttpException(`menu.find.one: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async dataMapper(data: MenuEntities, showJoin=false) {
        const items = await data.toResponseObject();

        if(showJoin) {
            const _code = await `${items.code}`.substring(0, 2);
            const subMenus = await this.menuRepositories.find({ where: { type: 2, code: Like(`${_code}%`), isMasterData: false }, order: { sort: "ASC"} });
            const subMasterDatas = await this.menuRepositories.find({ where: { type: 2, code: Like(`${_code}%`), isMasterData: true }, order: { sort: "ASC"} });

            await Object.assign(items, {
                subMenus: subMenus.map(item => item.toResponseObject()),
                subMasterDatas: subMasterDatas.map(item => item.toResponseObject())
            })
        }

        return await items;
    }


    async create(data: MenuCreateDTO, userId: number): Promise<MenuInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                active: true,
                createdBy: userId,
                createdAt: this.dateFormat("YYYY-MM-DD H:i:s"),
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            const creted = await this.menuRepositories.create(data);
            await this.menuRepositories.save(creted);

            return creted.toResponseObject();
        } catch (error) {
          throw new HttpException(`menu.create: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async update(id: number, data: MenuUpdateDTO, userId: number): Promise<MenuInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                active: true,
                createdBy: userId,
                createdAt: this.dateFormat("YYYY-MM-DD H:i:s"),
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            await this.menuRepositories.update(id, data);

            return await this.menuRepositories.findOne({ where: {id} });
        } catch (error) {
          throw new HttpException(`menu.update: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }



    async delete(id: number, userId: number) {
        try {

            const deleted = await this.menuRepositories.delete(id);

            if(deleted) {
                return true;
            } else {
                throw new HttpException(`menu.delete.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`menu.delete: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async restore(id: number, userId: number) {
        try {

            const restored = await this.menuRepositories.restore(id);
            await this.menuRepositories.update(id, { deletedBy: null });

            if(restored) {
                return true;
            } else {
                throw new HttpException(`menu.restore.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`menu.restored: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
