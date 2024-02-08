export interface EventLogsInterfaces {
    id: number;
    timestamp: Date;
    ip: string;
    method: string;
    path: string;
    requestPayload: string;
    origin: string;
    apiName: string;
    moduleId: number;
    module: string;
    subModule: string;
    subModuleId: number;
    userId: number;
    detail: string;
}