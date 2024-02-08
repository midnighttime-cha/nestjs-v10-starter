import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntities } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserCreateDTO, UserRegisterDTO, UserUpdateDTO } from './dto/user.dto';
import { UserInterfaces } from './interfaces/user.interface';
import { AuthDTO } from 'src/auth/dto/auth.dto';
import { HelperService } from 'src/shared/helpers/helper.service';

@Injectable()
export class UserService extends HelperService {
    constructor(
        @InjectRepository(UserEntities)
        private readonly userRepositories: Repository<UserEntities>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
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
                const {  firstName, lastName, username, email, phoneNo, mobileNo } = filters;

                const filterLikes = { firstName, lastName, username, email, phoneNo, mobileNo };
                const filterEquals = {  };
                
                // for (const key in filterEquals) {
                //     if(typeof filterEquals[key] !== "undefined") {
                //         await conditions.andWhere(`A.${key} = :value`, { value: filterEquals[key] })
                //     }
                // }

                for (const key in filterLikes) {
                    if(typeof filterLikes[key] !== "undefined") {
                        await conditions.andWhere(`A.${key} LIKE '%${filterLikes[key]}%'`)
                    }
                }
            }

            return await conditions;
        } catch (error) {
            throw new HttpException(`[do filter failed.] => ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async findData(filters: any = null, pages: any = null, id: number = 0) {
        try {
            const conditions = await this.userRepositories.createQueryBuilder("A");
        
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
            const items = await getItems.map(element => element.toResponseObject());
        
            return { items, total };
        } catch (error) {
            throw new HttpException(`[find failed.] => ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async findOneData(filters: any = null, id: number = 0) {
        try {
            const conditions = await this.userRepositories.createQueryBuilder("A");
        
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
            throw new HttpException(`[find one failed.] => ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async validateUser(username: string) {
        const users = await this.userRepositories.createQueryBuilder("A")
          .where("A.username = :username", { username })
          .getOne();
    
        if (!users) {
          throw new HttpException(`user.find.isnull`, HttpStatus.BAD_REQUEST);
        }
    
        return users;
    }


    async findUserOne(username: string) {
        const users = await this.userRepositories.createQueryBuilder("A")
          .where("A.username = :username", { username })
          .getOne();
    
        if (!users) {
          throw new HttpException(`user.find.isnull`, HttpStatus.BAD_REQUEST);
        }
    
        return users.toResponseObject();
    }


    async register(data: UserRegisterDTO): Promise<UserInterfaces> {
        try {
            const users = new UserEntities();
            const {  username, password, firstName, lastName, email } = data;

            const date = this.dateFormat('YYMM');
            const getSeq = await this.entityManager.query(`SELECT * FROM auth.users_id_seq`);
            const nextval: number = getSeq[0].is_called ? parseInt(getSeq[0].last_value) + 1 : getSeq[0].last_value;

            users.code = `${date}${`${nextval}`.padStart(6, '0')}`;
            users.username = username;
            users.password = password;
            users.firstName = firstName;
            users.lastName = lastName;
            users.email = email;
            users.active = true;
            users.createdBy = 1;
            users.createdAt = this.dateFormat("YYYY-MM-DD H:i:s");
            users.updatedBy = 1;
            users.updatedAt = this.dateFormat("YYYY-MM-DD H:i:s");;

            const createUsers = await this.userRepositories.create(users);
            await this.userRepositories.save(createUsers);

            return createUsers.toResponseObject();
        } catch (error) {
          throw new HttpException(`user.register: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async userValidate(data: AuthDTO) {
        try {
          const { username, password } = data;
    
          const users = await this.userRepositories.findOne({
            where: {
              username
            }
          });
    
          if (!users || (!await users.comparePassword(password))) {
            throw new HttpException("Invalid username/password.", HttpStatus.BAD_REQUEST);
          }
    
          return users.toResponseObject(false, true);
        } catch (error) {
          throw new HttpException(`user.validate: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }




    async create(data: UserCreateDTO, userId: number): Promise<UserInterfaces> {
        try {
            const date = this.dateFormat('YYMM');
            const getSeq = await this.entityManager.query(`SELECT * FROM auth.users_id_seq`);
            const nextval: number = getSeq[0].is_called ? parseInt(getSeq[0].last_value) + 1 : getSeq[0].last_value;

            Object.assign(data, {
                ...data,
                code: `${date}${`${nextval}`.padStart(6, '0')}`,
                active: true,
                createdBy: userId,
                createdAt: this.dateFormat("YYYY-MM-DD H:i:s"),
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            const creted = await this.userRepositories.create(data);
            await this.userRepositories.save(creted);

            return creted.toResponseObject();
        } catch (error) {
          throw new HttpException(`user.create: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async update(id: number, data: UserUpdateDTO, userId: number): Promise<UserInterfaces> {
        try {
            Object.assign(data, {
                ...data,
                updatedBy: userId,
                updatedAt: this.dateFormat("YYYY-MM-DD H:i:s"),
            });

            await this.userRepositories.update(id, data);

            return await this.userRepositories.findOne({ where: {id} });
        } catch (error) {
          throw new HttpException(`user.update: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }



    async delete(id: number, userId: number) {
        try {

            const deleted = await this.userRepositories.softDelete(id);
            await this.userRepositories.update(id, { deletedBy: userId });

            if(deleted) {
                return true;
            } else {
                throw new HttpException(`user.delete.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`user.delete: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }


    async restore(id: number, userId: number) {
        try {

            const restored = await this.userRepositories.restore(id);
            await this.userRepositories.update(id, { deletedBy: null });

            if(restored) {
                return true;
            } else {
                throw new HttpException(`user.restore.failed`, HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
          throw new HttpException(`user.restored: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
