export interface MenuInterfaces {
    id: number;
    code: string;
    title: string;
    icon: string;
    type: number;
    mainUrl: string;
    subUrl: string;
    sort: number;
    active: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: Date;
    updatedAt: Date;
}