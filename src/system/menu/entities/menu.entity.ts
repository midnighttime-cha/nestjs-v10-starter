import { HelperService } from "src/shared/helpers/helper.service";
import { UserRoleEntities } from "src/user/entities/user-role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "menus", schema: "system" })
export class MenuEntities extends HelperService {

    constructor(){
        super();
    }
    
    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;
    
    @Column({ name: "code", type: "char", length: 4, unique: true })
    code: string;
    
    @Column({ name: "title", type: "varchar", nullable: true, length: 255 })
    title: string;
    
    @Column({ name: "icon", type: "varchar", length: 100, nullable: true })
    icon: string;
    
    @Column({ name: "type", type: "int4", default: 1 })
    type: number;
    
    @Column({ name: "main_url", type: "varchar", length: 255 })
    mainUrl: string;
    
    @Column({ name: "sub_url", type: "varchar", length: 255, nullable: true })
    subUrl: string;

    @Column({ name: "is_master_data", type: "bool", default: false })
    isMasterData: boolean;
    
    @Column({ name: "sort", type: "int4", default: 0 })
    sort: number;
    
    @Column({ name: "active", type: "bool", default: true }) 
    active: boolean;
    
    @Column({ name: "created_by", type: "int4" }) 
    createdBy: number;
    
    @Column({ name: "updated_by", type: "int4", nullable: true })
    updatedBy: number;
    
    @Column({ name: "deleted_by", type: "int4", nullable: true })
    deletedBy: number;
    
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;
    
    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
    updatedAt: Date;
    
    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt: Date;
    

    @OneToMany(type => UserRoleEntities, roles => roles.menuId, { cascade: true })
    @JoinColumn({ name: "id" }) userRoles: UserRoleEntities;

    toResponseObject(showDelete=false, showJoin=false) {
        const { id, code, title, icon, type, mainUrl, subUrl, sort, active, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, isMasterData, userRoles } = this;
        const responseObjects: any = { id, code, title, icon, type, mainUrl, subUrl, sort, active, createdBy, updatedBy, isMasterData };

        Object.assign(responseObjects, {
            createdAt: this.dateFormat("YYYY-MM-DD H:i:s", createdAt),
            updatedAt: this.dateFormat("YYYY-MM-DD H:i:s", updatedAt)
        })

        if(showDelete) {
            Object.assign(responseObjects, {
                deletedBy,
                deletedAt: this.dateFormat("YYYY-MM-DD H:i:s", deletedAt)
            })
        }

        if(showJoin) {
            Object.assign(responseObjects, {
                userRoles: userRoles.toResponseObject()
            })
        }

        return responseObjects;
    }
}