import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntities } from "./user.entity";
import { MenuEntities } from "src/system/menu/entities/menu.entity";

@Entity({ name: "user_roles", schema: "auth" })
export class UserRoleEntities {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;
    
    @Column({ name: "role_name", type: "varchar", length: 255 })
    roleName: string;
    
    @Column({ name: "user_id", type: "int4" })
    userId: number;
    
    @Column({ name: "menu_id", type: "int4" })
    menuId: number;
    
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
    

    @ManyToOne(type => UserEntities, user => user.id, { cascade: true })
    @JoinColumn({ name: 'user_id' }) users: UserEntities;

    @ManyToOne(type => MenuEntities, menu => menu.id, { cascade: true })
    @JoinColumn({ name: "menu_id" }) menus: MenuEntities;
    
    toResponseObject(showJoin=false) {
        const { userId, menuId, canAccess, canView, canCreate, canModify, canDelete, canApprove, users, menus } = this;
        const responseObject = { userId, menuId, canAccess, canView, canCreate, canModify, canDelete, canApprove };

        if(showJoin) {
            Object.assign(responseObject, {
                users: users.toResponseObject(),
                menus: menus.toResponseObject()
            });
        }
        
        return responseObject;
    }
}