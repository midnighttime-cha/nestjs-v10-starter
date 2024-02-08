import { GeographyEntities } from "src/master-data/geography/entities/geography.entity";
import { HelperService } from "src/shared/helpers/helper.service";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProvinceInterfaces } from "../interfaces/province.interface";

@Entity({ name: "provinces", schema: "masterData" })
export class ProvinceEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "name_th", type: "varchar", length: 255, nullable: true })
    nameTh: string;

    @Column({ name: "name_en", type: "varchar", length: 255, nullable: true })
    nameEn: string;

    @Column({ name: "geography_id", type: "int4", nullable: true })
    geographyId: number;

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

    @ManyToOne(type => GeographyEntities, geo => geo.id)
    @JoinColumn({ name: "geography_id" }) geographies: GeographyEntities;

    toResponseObject(showDelete=false, showJoin=false): Promise<ProvinceInterfaces | undefined > {
        const { id, nameTh, nameEn, geographyId, active, createdAt, updatedAt, createdBy, updatedBy, deletedBy, deletedAt, geographies } = this;
        const responseObjects: any = { id, nameTh, nameEn, geographyId, active, createdBy, updatedBy };

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

        if(showJoin) {
            Object.assign(responseObjects, {
                geographies: geographies.toResponseObject()
            })
        }

        return responseObjects;
    }

}