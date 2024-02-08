import { ProvinceInterfaces } from "src/master-data/geography/interfaces/province.interface";

export interface DistrictInterfaces {

    id: number;
    provinceId: number;
    nameTh: string;
    nameEn: string;
    active: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: Date;
    updatedAt: Date;
    provinces: ProvinceInterfaces;

}