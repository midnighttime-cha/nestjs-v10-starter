import { DistrictInterfaces } from "src/master-data/geography/interfaces/district.interface";

export interface SubDistrictInterfaces {

    id: number;
    districtId: number;
    nameTh: string;
    nameEn: string;
    zipCode: string;
    active: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: Date;
    updatedAt: Date;
    districts: DistrictInterfaces;
}