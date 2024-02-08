import { HelperService } from "src/shared/helpers/helper.service";
import { UserEntities } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'event_logs', schema: 'system' })
export class EventLogsEntities extends HelperService {

    constructor(){
        super();
    }

    @PrimaryGeneratedColumn({ name: 'id', type: "int4" })
    id: number;

    @CreateDateColumn({ name: 'timestamp', type: "timestamp" })
    timestamp: Date;

    @Column({ name: 'ip', nullable: true, type: "varchar", length: 100 })
    ip: string;

    @Column({ name: 'method', nullable: true, type: "varchar", length: 50 })
    method: string;

    @Column({ name: 'path', nullable: true, type: "varchar", length: 120 })
    path: string;

    @Column({ name: 'request_payload', nullable: true, type: "text" })
    requestPayload: string;

    @Column({ name: 'origin', nullable: true, type: "varchar", length: 120 })
    origin: string;

    @Column({ name: 'api_name', nullable: true, type: "varchar", length: 255 })
    apiName: string;

    @Column({ name: 'module_id', nullable: true, type: "int4" })
    moduleId: number;

    @Column({ name: 'module', nullable: true, type: "varchar", length: 120 })
    module: string;

    @Column({ name: 'sub_module', nullable: true, type: "varchar", length: 120 })
    subModule: string;

    @Column({ name: 'sub_module_id', nullable: true, type: "int4" })
    subModuleId: number;

    @Column({ name: 'user_id', nullable: true, type: "int4" })
    userId: number;

    @Column({ name: 'detail', nullable: true, type: "text" })
    detail: string;

    @ManyToOne(type => UserEntities, user => user.id)
    @JoinColumn({ name: "user_id" }) users: UserEntities;


    toResponseObject(showDelete=false, showJoin=false) {
        const { id, timestamp, ip, method, path, requestPayload, origin, apiName, moduleId, module, subModule, subModuleId, userId, detail, users } = this;
        const responseData = { id };

        Object.assign(responseData, {
            timestamp: this.dateFormat("YYYY-MM-DD H:i:s", timestamp)
        });
        
        Object.assign(responseData, {
            ip, method, path, requestPayload, origin, apiName, moduleId, module, subModule, subModuleId, userId, detail
        });

        if(showJoin) {
            Object.assign(responseData, {
                users: users.toResponseObject()
            });
        }
        
        return responseData;
    }
}