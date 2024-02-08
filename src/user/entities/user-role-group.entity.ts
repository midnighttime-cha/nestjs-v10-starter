import { HelperService } from "src/shared/helpers/helper.service";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user_groups", schema: "auth" })
export class UserRoleGroupEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "group_name", type: "varchar", length: 255 })
    groupName: string;

    @Column({ name: "can_access", type: "bool", default: false })
    canAccess: boolean;
    
    @Column({ name: "can_view", type: "bool", default: false })
    canView: boolean;
    
    @Column({ name: "can_create", type: "bool", default: false })
    canCreate: boolean;
    
    @Column({ name: "can_modify", type: "bool", default: false })
    canModify: boolean;
    
    @Column({ name: "can_delete", type: "bool", default: false })
    canDelete: boolean;
    
    @Column({ name: "can_approve", type: "bool", default: false })
    canApprove: boolean;

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


    toResponseObject(showDelete = false) {
        const { id, groupName, canAccess, canView, canCreate, canModify, canDelete, canApprove, active, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt } = this;
        const responseObjects: any = { id, groupName, canAccess, canView, canCreate, canModify, canDelete, canApprove, active, createdBy, updatedBy };

        Object.assign(responseObjects, { 
            createdAt: this.dateFormat("YYYY-MM-DD H:i:s", createdAt), 
            updatedAt: this.dateFormat("YYYY-MM-DD H:i:s", updatedAt)
        });

        if(showDelete) {
            Object.assign(responseObjects, { 
                deletedBy, 
                deletedAt: this.dateFormat("YYYY-MM-DD H:i:s", deletedAt)
            });
        }

        return responseObjects;
    }
}