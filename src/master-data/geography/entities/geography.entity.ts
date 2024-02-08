import { HelperService } from "src/shared/helpers/helper.service";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "geographies", schema: "masterData" })
export class GeographyEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "active", type: "bool", default: true })
    active: boolean;

    @Column({ name: "created_by", type: "int4", nullable: true, default: 1 })
    createdBy: number;

    @Column({ name: "updated_by", type: "int4", nullable: true, default: 1 })
    updatedBy: number;

    @Column({ name: "deleted_by", type: "int4", nullable: true })
    deletedBy: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt: Date;

    toResponseObject(showDelete=false) {
        const { id, name, active, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt } = this;
        const responseObjects: any = { id, name, active, createdBy, updatedBy};

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