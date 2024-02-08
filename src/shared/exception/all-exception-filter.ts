import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';
import { EventLogService } from "src/system/event-log/event-log.service";
import { HelperService } from "../helpers/helper.service";
import CryptoJS = require('crypto-js');

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly eventLogServices: EventLogService,
        private readonly helperServices: HelperService
    ){}

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const request = ctx.getRequest();        
        const response = ctx.getResponse();
        const authorization = (`${request.headers.authorization}`.split('Bearer '))[1];
        
        let message = exception['response'] || 'Bad Request';
        let userId = 1;

        if (httpStatus === HttpStatus.UNAUTHORIZED) {
            message = typeof exception !== 'string' ? 'You do not have permission to access this resource' : exception['response'];
        } else if (httpStatus == HttpStatus.FORBIDDEN) {
            const bearer = jwt.decode(authorization);
            if (bearer) {
                if (bearer[`exp`] < (Date.now() / 1000)) {
                    message = typeof exception !== 'string' ? 'You do not have permission to access this resource' : exception['response'];
                }
            }
        }

        if(typeof authorization !== "undefined") {
            const bearerAuth = jwt.decode(authorization);
            const bytes = CryptoJS.AES.decrypt(bearerAuth.payload, process.env.APP_SECRET);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            const decryptedData_parse = JSON.parse(decryptedData);
            console.log(decryptedData_parse);
            
            userId = decryptedData_parse.id;
        }
        const timestamp = this.helperServices.dateFormat("YYYY-MM-DD H:i:s");

        const responseBody = {
            statusCode: httpStatus,
            timestamp,
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            method: request.method,
            message,
            displayTotal: 0,
            total: 0,
            state: null,
            items: {}
        }
        
        this.eventLogServices.createData({
            userId,
            ip: request.ip,
            method: request.method,
            path: request.path,
            origin: request.headers.host,
            apiName: "Exception Error Message",
            requestPayload: JSON.stringify(request.body),
            timestamp,
            moduleId: 0,
            module: "ERROR",
            subModule: "",
            subModuleId: 0,
            detail: message
        });

        httpAdapter.reply(response, responseBody, httpStatus);
    }
}