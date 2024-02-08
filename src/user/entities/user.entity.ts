import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, getManager } from "typeorm";
import * as bcrypt from 'bcryptjs';
import fs = require("fs");
import * as jwt from 'jsonwebtoken';
import { UserInterfaces } from "../interfaces/user.interface";
import { UserRoleGroupEntities } from "./user-role-group.entity";
import { UserRoleEntities } from "./user-role.entity";
import CryptoJS = require("crypto-js");
import { HelperService } from "src/shared/helpers/helper.service";

@Entity({ name: "users", schema: "auth" })
export class UserEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 25 })
    code: string;

    @Column({ name: "type", type: "varchar", length: 20, enum: ["SYSTEM", "ADMIN", "USER"], default: "USER" })
    type: string;

    @Column({ name: "first_name", type: "varchar", length: 255 })
    firstName: string;

    @Column({ name: "last_name", type: "varchar", length: 255, nullable: true })
    lastName: string;

    @Column({ name: "username", type: "varchar", length: 120 })
    username: string;

    @Column({ name: "password", type: "varchar", length: 400 })
    password: string;

    @Column({ name: "email", type: "varchar", length: 255, nullable: true })
    email: string;

    @Column({ name: "phone_no", type: "varchar", length: 25, nullable: true })
    phoneNo: string;

    @Column({ name: "mobile_no", type: "varchar", length: 25, nullable: true })
    mobileNo: string;

    @Column({ name: "role_group_id", type: "int4", nullable: true })
    roleGroupId: number;

    @Column({ name: "active", type: "bool", default: true }) 
    active: boolean;

    @Column({ name: "created_by", type: "int4" }) 
    createdBy: number;

    @Column({ name: "updated_by", type: "int4", nullable: true })
    updatedBy: number;

    @Column({ name: "deleted_by", type: "int4", nullable: true, select: false })
    deletedBy: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true, select: false })
    deletedAt: Date;


    @ManyToOne(type => UserRoleEntities, group => group.id, { cascade: true })
    @JoinColumn({ name: "role_group_id" }) userRoleGroups: UserRoleGroupEntities;

    @OneToMany(type => UserRoleEntities, role => role.userId, { cascade: true })
    @JoinColumn({ name: "id"  }) userRoles: UserRoleEntities[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password.trim(), 10);
    }

    private strEncrypt(text) {
      const ciphertext = CryptoJS.AES.encrypt(text, process.env.APP_SECRET).toString();
      return ciphertext;
    }

    private get accessToken() {
        // PAYLOAD
        const { id, type, email, code, username } = this;
        const payload = this.strEncrypt(JSON.stringify({ id, type, email, code, username }));
    
        // PRIVATE key
        const privateKEY = fs.readFileSync(`${process.env.APP_PRIVATE_KEY}`, 'utf8');
    
        const accessToken = jwt.sign({ payload }, privateKEY, {
            issuer: `${process.env.APP_ISSUER}`,
            subject: `${process.env.APP_SUBJECT}`,
            audience: `${process.env.APP_AUDIENCE}`,
            expiresIn: "1d",
            algorithm: "RS256"
        });
        return accessToken;
    }

    async comparePassword(text: string) {
        return await bcrypt.compare(text, this.password);
    }

    toResponseObject(showPassword: boolean = false, showToken: boolean = false, showDelete=false, showJoin=false): Promise<UserInterfaces | undefined> {
        const { id, code, type, username, password, firstName, lastName, email, phoneNo, mobileNo, active, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt, accessToken, userRoleGroups, userRoles } = this;
    
        const responseObject: any = { id, code, type, username };
    
        if (showPassword) {
          Object.assign(responseObject, {
            password
          });
        }
    
        Object.assign(responseObject, {
            firstName, lastName, email, phoneNo, mobileNo, active, createdBy, updatedBy, 
            createdAt: this.dateFormat("YYYY-MM-DD H:i:s", createdAt),
            updatedAt: this.dateFormat("YYYY-MM-DD H:i:s", updatedAt)
        });
    
        if (showToken) {
          Object.assign(responseObject, {
            accessToken
          });
        }

        if(showDelete) {
          Object.assign(responseObject, {
            deletedBy,
            deletedAt: this.dateFormat("YYYY-MM-DD H:i:s", deletedAt)
          });
        }
    
        if(showJoin) {
          Object.assign(responseObject, {
            userRoles: userRoles.map(item => item.toResponseObject()),
            userRoleGroups: userRoleGroups.toResponseObject()
          });
        }

        return responseObject;
    }
}