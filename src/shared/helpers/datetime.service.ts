import { Injectable } from "@nestjs/common";
import { HelperService } from "./helper.service";
import { ConvertService } from "./convert.service";

@Injectable()
export class DatetimeService extends ConvertService {

    constructor() {
        super();
    }
    
    dateNow(dt=null) {
        if(dt) return new Date(dt).toISOString().toLocaleString();
        return new Date().toISOString().toLocaleString();
    }
    
    daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    
    datetimeToServer(datetime = null) {
        let n;
        if (datetime) {
          n = new Date(datetime);
        } else {
          n = new Date();
        }
    
        const dt = n.toISOString().toLocaleString().slice(0, 10);
    
        return `${dt} ${n.toLocaleTimeString("th-TH", { hour12: false })}`;
    }
    
    dateToServer(date = null) {
        let n;
        if (date) {
          n = new Date(date);
        } else {
          n = new Date();
        }
    
        return n.toLocaleString().slice(0, 10);
    }
    
    dateTimeShort(datetime = null) {
        let d;
        if (datetime) {
          d = new Date(datetime);
        } else {
          d = new Date();
        }
    
        const dt = d.toISOString().toLocaleString();
    
        return `${dt.slice(8, 10)}/${dt.slice(5, 7)}/${dt.slice(0, 4)} ${d.toLocaleTimeString("th-TH", { hour12: false })}`
    }
    
    dateShort(date = null) {
        let d;
        if (date) {
          d = new Date(date);
        } else {
          d = new Date();
        }
    
        const dt = d.toISOString().toLocaleString();
    
        return `${dt.slice(8, 10)}/${dt.slice(5, 7)}/${dt.slice(0, 4)}`;
    }
    
    addDate(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + parseInt(days));
        return result;
    }
    
    removeDate(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - parseInt(days));
        return result;
    }
    
    dateFormat(type, datetime = null) {
        let date_str;
        let d = new Date();
        if (datetime) {
          d = new Date(`${datetime}`);
        }
    
        const dt = d.toLocaleString("en-TH", {
          hourCycle: "h23",
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
    
        const year = dt.slice(6, 10);
        const year_th = parseInt(year) + 543;
        const year2 = dt.slice(8, 10);
        const year2_th = (parseInt(year2) + 43);
        const month = dt.slice(0, 2);
        const date = dt.slice(3, 5);
        const time = `${dt.slice(11)}`.trim();
    
        switch (type) {
          case 'YY':
            date_str = year2;
            break;
          case 'YY TH':
            date_str = year2_th;
            break;
          case 'YYYY':
            date_str = year;
            break;
          case 'YYYY TH':
            date_str = year_th;
            break;
          case 'MM':
            date_str = month;
            break;
          case 'DD':
            date_str = date;
            break;
          case 'YYMM':
            date_str = `${year2}${month}`;
            break;
          case 'YYYYMM':
            date_str = `${year}${month}`;
            break;
          case 'YYMMDD':
            date_str = `${year2}${month}${date}`;
            break;
          case 'YYYYMMDD':
            date_str = `${year}${month}${date}`;
            break;
          case 'YYYY.MM.DD':
            date_str = `${year}.${month}.${date}`;
            break;
          case 'YY-MM':
            date_str = `${year2}-${month}`;
            break;
          case 'YY-MM-DD':
            date_str = `${year2}-${month}-${date}`;
            break;
          case 'YYYY-MM':
            date_str = `${year}-${month}`;
            break;
          case 'YYYY-MM-DD':
            date_str = `${year}-${month}-${date}`;
            break;
          case 'YYYY-MM-DD TH':
            date_str = `${year_th}-${month}-${date}`;
            break;
          case 'DD/MM/YY':
            date_str = `${date}/${month}/${year2}`;
            break;
          case 'DD/MM/YYYY':
            date_str = `${date}/${month}/${year}`;
            break;
          case 'DD/MM/YYYY TH':
            date_str = `${date}/${month}/${year_th}`;
            break;
          case 'DD.MM.YYYY':
            date_str = `${date}.${month}.${year}`;
            break;
          case 'H':
            date_str = time.slice(0, 2);
            break;
          case 'i':
            date_str = time.slice(3, 5);
            break;
          case 's':
            date_str = time.slice(6, 8);
            break;
          case 'H:i':
            date_str = time.slice(0, 5);
            break;
          case 'H:i:s':
            date_str = time;
            break;
          case 'YYYY/MM':
            date_str = `${year}/${month}`;
            break;
          case 'YYYY-MM-DD H:i':
            date_str = `${year}-${month}-${date} ${time.slice(0, 5)}`;
            break;
          case 'YYYY-MM-DD H:i:s':
            date_str = `${year}-${month}-${date} ${time}`;
            break;
          case 'DD/MM/YYYY H:i':
            date_str = `${date}/${month}/${year} ${time.slice(0, 5)}`
            break;
          case 'DD/MM/YYYY H:i:s':
            date_str = `${date}/${month}/${year} ${time}`
            break;
          case 'YYYY-MM-DD H:i:s TH':
            date_str = `${year_th}-${month}-${date} ${time}`;
            break;
          case 'DD/MM/YYYY H:i:s TH':
            date_str = `${year_th}/${month}/${year} ${time}`
            break;
        }
        return date_str;
    }
}