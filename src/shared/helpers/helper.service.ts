import { Injectable } from "@nestjs/common";
import { DatetimeService } from "./datetime.service";

@Injectable()
export class HelperService extends DatetimeService {
    constructor(){
        super();
    }
}