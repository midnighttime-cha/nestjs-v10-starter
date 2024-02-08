import { DistrictEntities } from "src/master-data/geography/entities/district.entity";
import { HelperService } from "src/shared/helpers/helper.service";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "sub_districts", schema: "masterData" })
export class SubDistrictEntities extends HelperService {

    @PrimaryGeneratedColumn({ name: "id", type: "int4" })
    id: number;

    @Column({ name: "district_id", type: "int4" })
    districtId: number;

    @Column({ name: "name_th", type: "varchar", length: 255 })
    nameTh: string;

    @Column({ name: "name_en", type: "varchar", length: 255, nullable: true })
    nameEn: string;

    @Column({ name: "zip_code", type: "varchar", length: 5 })
    zipCode: string;

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

    @ManyToOne(type => DistrictEntities, district => district.id)
    @JoinColumn({ name: "district_id" }) districts: DistrictEntities;

    toResponseObject(showDelete=false, showJoin=false) {
        const { id, districtId, nameTh, nameEn, zipCode, active, createdAt, updatedAt, createdBy, updatedBy, deletedBy, deletedAt, districts } = this;
        const responseObjects: any = { id, districtId, nameTh, nameEn, zipCode, active, createdBy, updatedBy };

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
                districts: districts.toResponseObject()
            })
        }

        return responseObjects;
    }
}