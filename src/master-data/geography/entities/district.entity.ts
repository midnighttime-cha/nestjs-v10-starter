import { ProvinceEntities } from "src/master-data/geography/entities/province.entity";
import { HelperService } from "src/shared/helpers/helper.service";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DistrictInterfaces } from "../interfaces/district.interface";

@Entity({ name: "districts", schema: "masterData" })
export class DistrictEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "province_id", type: "int4" })
    provinceId: number;

    @Column({ name: "name_th", type: "varchar", length: 255 })
    nameTh: string;

    @Column({ name: "name_en", type: "varchar", length: 255 })
    nameEn: string;

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

    @ManyToOne(type => ProvinceEntities, province => province.id)
    @JoinColumn({ name: "province_id"}) provinces: ProvinceEntities;


    toResponseObject(showDelete=false, showJoin=false): Promise<DistrictInterfaces | undefined> {
        const { id, provinceId, nameTh, nameEn, active, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, provinces } = this;
        const responseObjects: any = { id, provinceId, nameTh, nameEn, active, createdBy, updatedBy };

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
                provinces: provinces.toResponseObject()
            });
        }

        return responseObjects;
    }
}